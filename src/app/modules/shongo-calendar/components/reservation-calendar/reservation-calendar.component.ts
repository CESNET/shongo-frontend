import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { finalize, first, takeUntil } from 'rxjs/operators';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { WeekViewHourSegment } from 'calendar-utils';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { HttpParams } from '@angular/common/http';
import { ReservationRequest } from '../../../../shared/models/rest-api/reservation-request.interface';
import * as moment from 'moment';
import { IdentityClaims } from '../../../../shared/models/interfaces/identity-claims.interface';
import { CalendarSlot } from '../../../../shared/models/rest-api/slot.interface';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { ReservationRequestState } from '../../../../shared/models/enums/reservation-request-state.enum';
import { MatDialog } from '@angular/material/dialog';
import { RequestConfirmationDialogComponent } from '../../../../shared/components/request-confirmation-dialog/request-confirmation-dialog.component';
import { Interval } from 'src/app/shared/models/interfaces/interval.interface';
import { AlertService } from 'src/app/core/services/alert.service';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
import { ResourceType } from 'src/app/shared/models/enums/resource-type.enum';

type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}

const COLORS = {
  owned: {
    primary: '#f26161',
    secondary: '#ffb0b0',
  },
  created: {
    primary: '#84db87',
    secondary: '#cfffd1',
  },
  default: {
    primary: '#6daded',
    secondary: '#c9e4ff',
  },
};

interface CalendarEventMeta {
  reservationRequest: ReservationRequest;
  ownerName: string;
  ownerEmail: string;
}

@Component({
  selector: 'app-reservation-calendar',
  templateUrl: './reservation-calendar.component.html',
  styleUrls: ['./reservation-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('loading', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease', style({ opacity: 1 })),
      ]),
      transition(':leave', animate('200ms ease', style({ opacity: 0 }))),
    ]),
  ],
})
export class ReservationCalendarComponent implements OnInit, OnDestroy {
  @Output() slotSelected = new EventEmitter<CalendarSlot | null>();

  /**
   * Allows selecting time slots in calendar (default = false).
   */
  @Input() allowSlotSelection = false;

  /**
   * ID of selected resource. Calendar will automatically refresh
   * it's data when setting this property to display only resources with this ID.
   */
  @Input() set selectedResourceId(id: string | undefined) {
    this._selectedResourceId = id;

    if (id) {
      this.fetchReservations();
    }
  }

  /**
   * If true, calendar will highlight all reservations that belong to the current user.
   */
  @Input() set highlightUsersReservations(value: boolean) {
    this._highlightUsersReservations = value;
    this._onHighlightChange();
  }

  /**
   * Currently displayed date.
   */
  @Input() set viewDate(value: Date) {
    this._viewDate = value;
    this.handleViewOrDateChange();
    this._cd.detectChanges();
  }

  /**
   * Current calendar view (day, week, month).
   */
  @Input() set view(value: CalendarView) {
    this._view = value;
    this.handleViewOrDateChange();
    this._cd.detectChanges();
  }

  readonly refresh$ = new Subject<void>();
  readonly loading$: Observable<boolean>;
  readonly weekStartsOn: WeekStartsOn = 0;
  readonly CalendarView = CalendarView;

  private _events: CalendarEvent[] = [];
  private _createdEvent?: CalendarEvent;
  private _highlightUsersReservations = false;
  private _selectedResourceId?: string | null;
  private _viewDate = moment().toDate();
  private _view = CalendarView.Month;
  private _lastFetchedInterval?: Interval;

  private _destroy$ = new Subject<void>();
  private _loading$ = new BehaviorSubject<boolean>(true);

  constructor(
    private _resReqService: ReservationRequestService,
    private _resourceService: ResourceService,
    private _auth: AuthenticationService,
    private _settings: SettingsService,
    private _dialog: MatDialog,
    private _alert: AlertService,
    private _cd: ChangeDetectorRef
  ) {
    this.loading$ = this._loading$.asObservable();
  }

  get highlightUsersReservations(): boolean {
    return this._highlightUsersReservations;
  }

  get selectedResourceId(): string {
    return this.selectedResourceId;
  }

  get events(): CalendarEvent[] {
    return this._events;
  }

  get viewDate(): Date {
    return this._viewDate;
  }

  get view(): CalendarView {
    return this._view;
  }

  get selectedSlot(): CalendarSlot | undefined {
    if (this._createdEvent && this._createdEvent.end) {
      return { start: this._createdEvent.start, end: this._createdEvent.end };
    }
    return undefined;
  }

  set selectedSlot(slot: CalendarSlot | undefined) {
    if (!slot) {
      this._events = this._events.filter((evt) => evt !== this._createdEvent);
    } else if (this._createdEvent) {
      this._createdEvent.start = slot.start;
      this._createdEvent.end = slot.end;
    } else {
      this._createdEvent = this._createSelectionEvent(
        this._auth.identityClaims!,
        slot.start,
        slot.end
      );
      this._events.push(this._createdEvent);
    }

    this.refresh$.next();
  }

  ngOnInit(): void {
    this.fetchReservations();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  handleViewOrDateChange(): void {
    const interval = this._getInterval(this.viewDate);

    if (
      !this._lastFetchedInterval ||
      !this._isSubInterval(this._lastFetchedInterval, interval)
    ) {
      this.fetchReservations();
    }
  }

  fetchReservations(): void {
    this._loading$.next(true);

    const interval = this._getInterval(this.viewDate);

    let filter = new HttpParams()
      .set('interval_from', moment(interval.start).toISOString())
      .set('interval_to', moment(interval.end).toISOString());

    if (this._selectedResourceId) {
      filter = filter.set('resource', this._selectedResourceId);

      const resource = this._resourceService.findResourceById(
        this._selectedResourceId
      );
      if (resource) {
        const type =
          resource.type === ResourceType.VIRTUAL_ROOM
            ? ReservationType.ROOM_CAPACITY
            : ReservationType.PHYSICAL_RESOURCE;
        filter = filter.set('type', type);
      }
    }

    this._resReqService
      .fetchItems<ReservationRequest>(filter)
      .pipe(
        first(),
        finalize(() => this._loading$.next(false))
      )
      .subscribe({
        next: (reservations) => {
          this._events = this._createEvents(reservations);
          this._lastFetchedInterval = interval;

          if (this._createdEvent) {
            if (
              this._hasNoIntersection(
                this._createdEvent.start,
                this._createdEvent.end!
              )
            ) {
              this._events.push(this._createdEvent);
            } else {
              this.slotSelected.emit(null);
            }
          }
        },
        error: (err) => {
          console.error(err);
          this._alert.showError(
            $localize`:error message:Failed to fetch reservations`
          );
        },
      });
  }

  refresh(): void {
    this._loading$.next(true);
    setTimeout(() => this.fetchReservations(), 200);
  }

  openDate(date: Date): void {
    this._viewDate = date;
    this._view = CalendarView.Day;
    this.handleViewOrDateChange();
    this._cd.detectChanges();
  }

  startDragToCreate(segment: WeekViewHourSegment, segmentElement: HTMLElement) {
    const prevCreatedEvent = this._createdEvent;
    this._createdEvent = this._createSelectionEvent(
      this._auth.identityClaims!,
      segment.date
    );

    this._events = this._events
      .filter((event) => event !== prevCreatedEvent)
      .concat([this._createdEvent]);
    this.slotSelected.emit(this.selectedSlot);

    const segmentPosition = segmentElement.getBoundingClientRect();
    const endOfView = moment(this.viewDate).endOf('week').toDate();

    (fromEvent(document, 'mousemove') as Observable<MouseEvent>)
      .pipe(
        finalize(() => {
          delete this._createdEvent!.meta.tmpEvent;
          this.refresh$.next();
        }),
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          30
        );

        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = moment(segment.date)
          .add(minutesDiff, 'minute')
          .add(daysDiff, 'day')
          .toDate();
        if (
          newEnd > segment.date &&
          newEnd < endOfView &&
          this._hasNoIntersection(this._createdEvent!.start, newEnd)
        ) {
          this._createdEvent!.end = newEnd;
        }
        this.refresh$.next();
        this.slotSelected.emit(this.selectedSlot);
      });
  }

  getSlotString(event: CalendarEvent): string {
    if (event.end) {
      return `${moment(event.start).format('LLL')} - ${moment(event.end).format(
        'LLL'
      )}`;
    }
    return moment(event.start).format('LLL');
  }

  validateEventTimesChanged = ({
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent) => {
    return this._hasNoIntersection(newStart, newEnd!);
  };

  eventTimesChanged(
    eventTimesChangedEvent: CalendarEventTimesChangedEvent
  ): void {
    if (this.validateEventTimesChanged(eventTimesChangedEvent)) {
      const { event, newStart, newEnd } = eventTimesChangedEvent;
      event.start = newStart;
      event.end = newEnd;
      this.refresh$.next();
      this.slotSelected.emit(this.selectedSlot);
    }
  }

  clearSelectedSlot(): void {
    this._events = this._events.filter((event) => event !== this._createdEvent);
    this._createdEvent = undefined;
    this.slotSelected.emit(null);
    this.refresh$.next();
  }

  handleEventClick(event: CalendarEvent): void {
    const { reservationRequest } = event.meta as CalendarEventMeta;

    if (
      reservationRequest?.state === ReservationRequestState.CONFIRM_AWAITING &&
      this._settings.isAdmin
    ) {
      const dialogRef = this._dialog.open(RequestConfirmationDialogComponent, {
        data: { reservationRequest },
        maxWidth: '100ch',
        width: '95%',
      });
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((performedAction) => {
          if (performedAction) {
            this.fetchReservations();
          }
        });
    }
  }

  private _isSubInterval(
    superInterval: Interval,
    subInterval: Interval
  ): boolean {
    return (
      subInterval.start >= superInterval.start &&
      subInterval.end <= superInterval.end
    );
  }

  private _getInterval(viewDate: Date): Interval {
    let intervalFrom: Date;
    let intervalTo: Date;

    if (this.view === CalendarView.Day) {
      intervalFrom = moment(viewDate).startOf('day').toDate();
      intervalTo = moment(viewDate).endOf('day').toDate();
    } else if (this.view === CalendarView.Week) {
      intervalFrom = moment(viewDate).startOf('week').toDate();
      intervalTo = moment(viewDate).endOf('week').toDate();
    } else {
      const monthStart = moment(viewDate).startOf('month').toDate();
      const monthEnd = moment(viewDate).endOf('month').toDate();

      // If date is sunday return start of date, else return start of last sunday (month view starts on sunday).
      const intervalFromDay = moment(monthStart).day();
      intervalFrom =
        intervalFromDay === 7
          ? moment(monthStart).startOf('day').toDate()
          : moment(monthStart)
              .subtract(intervalFromDay, 'day')
              .startOf('day')
              .toDate();

      // If date is saturday return end saturday, else return end of next saturday (month view ends on saturday).
      const indervalToDay = moment(monthEnd).day();
      intervalTo =
        indervalToDay === 6
          ? moment(monthEnd).endOf('day').toDate()
          : moment(monthEnd)
              .add(6 - indervalToDay, 'day')
              .endOf('day')
              .toDate();
    }

    return { start: intervalFrom, end: intervalTo };
  }

  private _hasNoIntersection(start: Date, end: Date): boolean {
    return this._events.every(
      (event) =>
        event === this._createdEvent ||
        (event.end && event.end <= start) ||
        event.start >= end
    );
  }

  private _createEvents(
    reservationRequests: ApiResponse<ReservationRequest>
  ): CalendarEvent[] {
    const events = reservationRequests.items.map((resReq) =>
      this._createEvent(resReq)
    );

    return this._highlightEvents(
      events,
      this.highlightUsersReservations ?? false
    );
  }

  private _createEvent(reservationRequest: ReservationRequest): CalendarEvent {
    return {
      start: moment(reservationRequest.slot.start).toDate(),
      end: moment(reservationRequest.slot.end).toDate(),
      title: reservationRequest.description,
      meta: {
        reservationRequest,
        owner: reservationRequest.ownerName,
        ownerEmail: reservationRequest.ownerEmail,
      },
    };
  }

  private _createSelectionEvent(
    owner: IdentityClaims,
    start: Date,
    end?: Date
  ): CalendarEvent {
    return {
      id: this._events.length,
      title: $localize`:event name|Name of calendar event that user just selected:Selected time slot`,
      start,
      end: end ?? moment(start).add(30, 'minutes').toDate(),
      color: COLORS.created,
      meta: {
        tmpEvent: true,
        owner: owner?.name ?? $localize`:fallback text:Unknown`,
        ownerEmail: owner?.email ?? $localize`:fallback text:Unknown`,
      },
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    };
  }

  private _onHighlightChange(): void {
    this._events = this._highlightEvents(
      this._events,
      this._highlightUsersReservations
    );
    this.refresh$.next();
  }

  private _highlightEvents(
    events: CalendarEvent[],
    highlightMine: boolean
  ): CalendarEvent[] {
    let highlightedEvents: CalendarEvent[];

    if (highlightMine && this._auth.identityClaims) {
      const { name, email } = this._auth.identityClaims;

      highlightedEvents = events.map((event) => {
        if (event.meta.ownerEmail === email && event.meta.owner === name) {
          event.color = COLORS.owned;
          event.cssClass = 'cal-event-color--white';
        }
        return event;
      });
    } else {
      highlightedEvents = events.map((event) => {
        if (event === this._createdEvent) {
          event.color = COLORS.created;
        } else {
          event.color = COLORS.default;
        }
        event.cssClass = '';
        return event;
      });
    }

    return highlightedEvents;
  }
}
