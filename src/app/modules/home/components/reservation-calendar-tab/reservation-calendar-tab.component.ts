import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl } from '@angular/forms';
import { CalendarReservationsService } from '@app/modules/calendar-helper/services/calendar-reservations.service';
import { ERequestState } from '@app/shared/models/enums/request-state.enum';
import { IRequest } from '@app/shared/models/interfaces/request.interface';
import {
  ICalendarItem,
  IEventOwner,
  IInterval,
  ShongoCalendarComponent,
} from '@cesnet/shongo-calendar';
import { CalendarView } from 'angular-calendar';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ResourceType } from 'src/app/shared/models/enums/resource-type.enum';
import {
  PhysicalResource,
  Resource,
} from 'src/app/shared/models/rest-api/resource.interface';

@Component({
  selector: 'app-reservation-calendar-tab',
  templateUrl: './reservation-calendar-tab.component.html',
  styleUrls: ['./reservation-calendar-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationCalendarTabComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild(ShongoCalendarComponent)
  calendar!: ShongoCalendarComponent;

  filteredResources: PhysicalResource[];

  readonly calendarRequest$: Observable<IRequest<ICalendarItem[]>>;
  readonly tabletSizeHit$: Observable<BreakpointState>;
  readonly filterGroup = new FormGroup({
    resources: new FormControl<Resource[]>([]),
    highlightMine: new FormControl<boolean>(false),
    resourceFilter: new FormControl<string>(''),
  });
  readonly CalendarView = CalendarView;
  readonly ERequestState = ERequestState;
  readonly currentUser: IEventOwner;

  private _currentInterval?: IInterval;

  private readonly _destroy$ = new Subject<void>();
  private readonly _physicalResources: PhysicalResource[];
  private readonly _calendarRequest$ = new BehaviorSubject<
    IRequest<ICalendarItem[]>
  >({ data: [], state: ERequestState.SUCCESS });

  constructor(
    private _resourceService: ResourceService,
    private _br: BreakpointObserver,
    private _calendarResS: CalendarReservationsService
  ) {
    this.tabletSizeHit$ = this._createTabletSizeObservable();
    this.calendarRequest$ = this._calendarRequest$.asObservable();

    this._physicalResources = this._getPhysicalResources();
    this.filteredResources = this._physicalResources;
    this.currentUser = this._calendarResS.currentUser;
  }

  get displayedResources(): Resource[] {
    return this.filterGroup.get('resources')!.value ?? [];
  }

  ngOnInit(): void {
    const resourceFilter = this.filterGroup.get(
      'resourceFilter'
    ) as UntypedFormControl;
    resourceFilter.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((filter) => {
        this._filterResources(filter);
      });
  }

  ngAfterViewInit(): void {
    this._observeTabletSize(this.tabletSizeHit$);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  getNextDate(viewDate: Date, increment: 0 | 1 | -1): Date {
    if (increment === 0) {
      return moment().toDate();
    }
    return moment(viewDate).add(increment, 'days').toDate();
  }

  onDateSelection(moment: moment.Moment): void {
    this.calendar.viewDate = moment.toDate();
  }

  onIntervalChange(interval: IInterval): void {
    this._currentInterval = interval;
    this._fetchInterval(interval);
  }

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

  private _createTabletSizeObservable(): Observable<BreakpointState> {
    return this._br.observe('(max-width: 768px)');
  }

  private _observeTabletSize(state$: Observable<BreakpointState>): void {
    state$.pipe(takeUntil(this._destroy$)).subscribe((state) => {
      if (state.matches) {
        this.calendar.view = CalendarView.Day;
      }
    });
  }

  private _filterResources(filter: string): void {
    this.filteredResources = this._physicalResources.filter((resource) =>
      resource.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  private _getPhysicalResources(): PhysicalResource[] {
    if (!this._resourceService.resources) {
      return [];
    }
    return this._resourceService.resources.filter(
      (resource) => resource.type === ResourceType.PHYSICAL_RESOURCE
    ) as PhysicalResource[];
  }
}
