import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
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
import { FormControl, FormGroup } from '@angular/forms';
import { WeekViewHourSegment } from 'calendar-utils';
import { physicalResources } from 'src/app/models/data/physical-resources';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { HttpParams } from '@angular/common/http';
import { ReservationRequest } from '../../models/rest-api/reservation-request.interface';

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
  @Input() showResourceSelection = true;
  @Input() allowSlotSelection = false;
  @Input() set selectedResourceId(id: string | null) {
    this._selectedResourceId = id;
    this.setResource(id);
    this.fetchReservations();
  }

  // For usage in template.
  CalendarView = CalendarView;

  // Date where calendar starts.
  viewDate = new Date();

  // Current calendar view.
  view: CalendarView = CalendarView.Month;

  resources = physicalResources;
  filteredResources = this.resources;

  filterGroup = new FormGroup({
    resource: new FormControl(this.resources[0].id),
    highlightMine: new FormControl(false),
    resourceFilter: new FormControl(''),
  });

  dragToCreateActive = false;
  weekStartsOn: 0 = 0;

  events: CalendarEvent[] = [];
  createdEvent?: CalendarEvent;

  loading$: Observable<boolean>;
  private _destroy$ = new Subject<void>();
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _selectedResourceId?: string | null;

  constructor(
    private _resReqService: ReservationRequestService,
    private _cd: ChangeDetectorRef,
    private _auth: AuthenticationService
  ) {
    this.loading$ = this._loading$.asObservable();
  }

  ngOnInit(): void {
    this.fetchReservations();
    this._createHighlightSub();

    const resourceFilter = this.filterGroup.get(
      'resourceFilter'
    ) as FormControl;
    resourceFilter.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((filter) => {
        this._filterResources(filter);
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  fetchReservations(): void {
    this._loading$.next(true);

    const interval = this._getInterval(this.viewDate);
    const resource = this.filterGroup.get('resource')!.value;
    const filter = new HttpParams()
      .set('resource', resource)
      .set('intervalFrom', new Date(interval.start).toISOString())
      .set('intervalTo', new Date(interval.end).toISOString());

    this._resReqService
      .fetchItems<ReservationRequest>(filter)
      .pipe(first())
      .subscribe({
        next: (reservations) => {
          this._loading$.next(false);
          this.events = this._createEvents(reservations);
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

  setResource(resource: string | null): void {
    this.filterGroup.get('resource')!.setValue(resource);
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    const prevCreatedEvent = this.createdEvent;
    const { name, email } = this._auth.identityClaims!;

    this.createdEvent = {
      id: this.events.length,
      title: 'New reservation',
      start: segment.date,
      color: COLORS.created,
      meta: {
        tmpEvent: true,
        owner: name,
        ownerEmail: email,
      },
    };
    this.events = this.events
      .filter((event) => event !== prevCreatedEvent)
      .concat([this.createdEvent]);
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    (fromEvent(document, 'mousemove') as Observable<MouseEvent>)
      .pipe(
        finalize(() => {
          delete this.createdEvent!.meta.tmpEvent;
          this.dragToCreateActive = false;
          this._staticRefresh();
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
          this._hasNoIntersection(this.createdEvent!.start, newEnd)
        ) {
          this.createdEvent!.end = newEnd;
        }
        this._staticRefresh();
      });
  }

  getSlotString(event: CalendarEvent): string {
    const start = event.start.toLocaleTimeString();
    const end = event.end?.toLocaleTimeString();

    if (end) {
      return `${start} - ${end}`;
    }
    return start;
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
    return this.events.every(
      (event) =>
        event === this.createdEvent ||
        (event.end && event.end <= start) ||
        event.start >= end
    );
  }

  private _filterResources(filter: string): void {
    this.filteredResources = this.resources.filter((resource) =>
      resource.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  private _createEvents(
    reservations: ApiResponse<ReservationRequest>
  ): CalendarEvent[] {
    const events = reservations.items.map((reservation) => ({
      start: new Date(reservation.slot.start),
      end: new Date(reservation.slot.end),
      title: reservation.description,
      meta: {
        owner: reservation.ownerName,
        ownerEmail: reservation.ownerEmail,
      },
    }));

    const highlightMine = this.filterGroup.get('highlightMine')?.value;
    return this._highlightEvents(events, highlightMine ?? false);
  }

  private _staticRefresh(): void {
    this.events = [...this.events];
    this._cd.detectChanges();
  }

  private _createHighlightSub(): void {
    this.filterGroup
      .get('highlightMine')!
      .valueChanges.pipe(takeUntil(this._destroy$))
      .subscribe((highlightMine) => {
        this.events = this._highlightEvents(this.events, highlightMine);
      });
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
        }
        return event;
      });
    } else {
      highlightedEvents = events.map((event) => {
        if (event === this.createdEvent) {
          event.color = COLORS.created;
        } else {
          event.color = COLORS.default;
        }
        return event;
      });
    }

    return highlightedEvents;
  }
}
