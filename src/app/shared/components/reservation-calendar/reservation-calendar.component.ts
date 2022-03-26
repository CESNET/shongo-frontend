import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { finalize, first, takeUntil } from 'rxjs/operators';
import {
  addDays,
  addMinutes,
  endOfDay,
  endOfMonth,
  endOfWeek,
  isSaturday,
  isSunday,
  nextSaturday,
  previousSunday,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { WeekViewHourSegment } from 'calendar-utils';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { HttpParams } from '@angular/common/http';
import { ReservationRequest } from '../../models/rest-api/reservation-request.interface';
import * as moment from 'moment';
import { IdentityClaims } from '../../models/interfaces/identity-claims.interface';
import { CalendarSlot } from '../../models/rest-api/slot.interface';

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

    // Clear created event to prevent event intersections.
    this._createdEvent = undefined;
    this.slotSelected.emit(null);
    this.fetchReservations();
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
    this.fetchReservations();
  }

  /**
   * Current calendar view (day, week, month).
   */
  @Input() set view(value: CalendarView) {
    this._view = value;
    this.fetchReservations();
  }

  readonly refresh$ = new Subject<void>();
  readonly loading$: Observable<boolean>;
  readonly weekStartsOn: WeekStartsOn = 0;
  readonly CalendarView = CalendarView;

  private _events: CalendarEvent[] = [];
  private _createdEvent?: CalendarEvent;
  private _highlightUsersReservations = false;
  private _selectedResourceId?: string | null;
  private _viewDate = new Date();
  private _view = CalendarView.Month;

  private _destroy$ = new Subject<void>();
  private _loading$ = new BehaviorSubject<boolean>(true);

  constructor(
    private _resReqService: ReservationRequestService,
    private _auth: AuthenticationService
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

  ngOnInit(): void {
    this.fetchReservations();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  fetchReservations(): void {
    this._loading$.next(true);

    const interval = this._getInterval(this.viewDate);
    let filter = new HttpParams()
      .set('interval_from', moment(interval.start).unix())
      .set('interval_to', moment(interval.end).unix());

    if (this._selectedResourceId) {
      filter = filter.set('resource', this._selectedResourceId);
    }

    this._resReqService
      .fetchItems<ReservationRequest>(filter)
      .pipe(first())
      .subscribe({
        next: (reservations) => {
          this._loading$.next(false);
          this._events = this._createEvents(reservations);

          if (this._createdEvent) {
            this._events.push(this._createdEvent);
          }
        },
        error: () => {
          this._loading$.next(false);
        },
      });
  }

  refresh(): void {
    this._loading$.next(true);
    setTimeout(() => this.fetchReservations(), 200);
  }

  openDate(date: Date): void {
    this.viewDate = date;
    this.view = CalendarView.Day;
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    _: MouseEvent,
    segmentElement: HTMLElement
  ) {
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
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

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

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
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

  private _getInterval(viewDate: Date): Interval {
    let intervalFrom: Date;
    let intervalTo: Date;

    if (this.view === CalendarView.Day) {
      intervalFrom = startOfDay(viewDate);
      intervalTo = endOfDay(viewDate);
    } else if (this.view === CalendarView.Week) {
      intervalFrom = startOfWeek(viewDate);
      intervalTo = endOfWeek(viewDate);
    } else {
      const monthStart = startOfMonth(viewDate);
      const monthEnd = endOfMonth(viewDate);

      intervalFrom = isSunday(monthStart)
        ? monthStart
        : startOfDay(previousSunday(monthStart));
      intervalTo = isSaturday(monthEnd)
        ? endOfDay(monthEnd)
        : endOfDay(nextSaturday(monthEnd));
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
    reservations: ApiResponse<ReservationRequest>
  ): CalendarEvent[] {
    const events = reservations.items.map((reservation) =>
      this._createEvent(reservation)
    );

    return this._highlightEvents(
      events,
      this.highlightUsersReservations ?? false
    );
  }

  private _createEvent(reservation: ReservationRequest): CalendarEvent {
    return {
      start: new Date(reservation.slot.start),
      end: new Date(reservation.slot.end),
      title: reservation.description,
      meta: {
        owner: reservation.ownerName,
        ownerEmail: reservation.ownerEmail,
      },
    };
  }

  private _createSelectionEvent(
    owner: IdentityClaims,
    start: Date
  ): CalendarEvent {
    return {
      id: this._events.length,
      title: 'Selected time slot',
      start,
      end: moment(start).add(30, 'minutes').toDate(),
      color: COLORS.created,
      meta: {
        tmpEvent: true,
        owner: owner.name,
        ownerEmail: owner.email,
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
