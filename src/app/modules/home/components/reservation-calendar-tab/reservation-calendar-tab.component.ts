import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LayoutService } from '@app/core/services/layout.service';
import { CalendarReservationsService } from '@app/modules/calendar-helper/services/calendar-reservations.service';
import { ERequestState } from '@app/shared/models/enums/request-state.enum';
import { IRequest } from '@app/shared/models/interfaces/request.interface';
import { Resource } from '@app/shared/models/rest-api/resource.interface';
import { CalendarSlot } from '@app/shared/models/rest-api/slot.interface';
import {
  ICalendarItem,
  IEventOwner,
  IInterval,
  ShongoCalendarComponent,
} from '@cesnet/shongo-calendar';
import { CalendarView } from 'angular-calendar';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-reservation-calendar-tab',
  templateUrl: './reservation-calendar-tab.component.html',
  styleUrls: ['./reservation-calendar-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationCalendarTabComponent implements AfterViewInit {
  @ViewChild(ShongoCalendarComponent)
  calendar!: ShongoCalendarComponent;

  displayedResources: Resource[] = [];
  selectedResource?: Resource | null;
  selectedSlot?: CalendarSlot | null;

  readonly calendarRequest$: Observable<IRequest<ICalendarItem[]>>;
  readonly CalendarView = CalendarView;
  readonly ERequestState = ERequestState;
  readonly currentUser: IEventOwner;

  private _currentInterval?: IInterval;

  private readonly _calendarRequest$ = new BehaviorSubject<
    IRequest<ICalendarItem[]>
  >({ data: [], state: ERequestState.SUCCESS });

  constructor(
    private _calendarResS: CalendarReservationsService,
    private _layoutS: LayoutService,
    private _destroyRef: DestroyRef
  ) {
    this.calendarRequest$ = this._calendarRequest$.asObservable();
    this.currentUser = this._calendarResS.currentUser;
  }

  get isTabletSize$(): Observable<boolean> {
    return this._layoutS.isTabletSize$;
  }

  ngAfterViewInit(): void {
    this._observeTabletSize();
  }

  getNextDate(viewDate: Date, increment: 0 | 1 | -1): Date {
    if (increment === 0) {
      return moment().toDate();
    }
    return moment(viewDate).add(increment, 'days').toDate();
  }

  onSelectedResourceChange(resource: Resource | null): void {
    this.selectedResource = resource;
  }

  onDisplayedResourcesChange(resources: Resource[]): void {
    this.displayedResources = resources;
    this.refetchInterval();
  }

  onDateSelection(date: Date): void {
    this.calendar.viewDate = date;
  }

  onIntervalChange(interval: IInterval): void {
    this._currentInterval = interval;
    this._fetchInterval(interval);
  }

  onItemClick(item: ICalendarItem): void {}

  refetchInterval(): void {
    if (this._currentInterval) {
      this._fetchInterval(this._currentInterval);
    }
  }

  /**
   * Fetches reservations for a given interval.
   *
   * @param interval Interval to fetch reservations for.
   */
  private _fetchInterval(interval: IInterval): void {
    this._calendarResS
      .fetchInterval$(this.displayedResources!, interval)
      .subscribe((req) => this._calendarRequest$.next(req));
  }

  private _observeTabletSize(): void {
    this.isTabletSize$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((isTableSize) => {
        if (isTableSize) {
          this.calendar.view = CalendarView.Day;
        }
      });
  }
}
