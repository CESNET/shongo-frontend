import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CalendarView } from 'angular-calendar';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ReservationCalendarComponent } from 'src/app/modules/shongo-calendar/components/reservation-calendar/reservation-calendar.component';
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
  @ViewChild(ReservationCalendarComponent)
  calendar!: ReservationCalendarComponent;

  filteredResources: PhysicalResource[];

  readonly tabletSizeHit$: Observable<BreakpointState>;
  readonly filterGroup = new UntypedFormGroup({
    resources: new UntypedFormControl([]),
    highlightMine: new UntypedFormControl(false),
    resourceFilter: new UntypedFormControl(''),
  });

  readonly CalendarView = CalendarView;
  private readonly _destroy$ = new Subject<void>();
  private readonly _physicalResources: PhysicalResource[];

  constructor(
    private _resourceService: ResourceService,
    private _br: BreakpointObserver
  ) {
    this.tabletSizeHit$ = this._createTabletSizeObservable();
    this._physicalResources = this._getPhysicalResources();
    this.filteredResources = this._physicalResources;
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
