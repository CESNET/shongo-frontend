import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CalendarView } from 'angular-calendar';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ResourceType } from 'src/app/shared/models/enums/resource-type.enum';
import { PhysicalResource } from 'src/app/shared/models/rest-api/resource.interface';

@Component({
  selector: 'app-reservation-calendar-tab',
  templateUrl: './reservation-calendar-tab.component.html',
  styleUrls: ['./reservation-calendar-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationCalendarTabComponent implements OnInit, OnDestroy {
  selectedResourceId?: string;
  filteredResources: PhysicalResource[];

  readonly filterGroup = new FormGroup({
    resource: new FormControl(null),
    highlightMine: new FormControl(false),
    resourceFilter: new FormControl(''),
  });

  readonly CalendarView = CalendarView;
  private readonly _destroy$ = new Subject<void>();
  private readonly _physicalResources: PhysicalResource[];

  constructor(private _resourceService: ResourceService) {
    this._physicalResources = this._getPhysicalResources();
    this.filteredResources = this._physicalResources;
  }

  ngOnInit(): void {
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

  setResource(resource: string | null): void {
    this.filterGroup.get('resource')!.setValue(resource);
  }

  getNextDate(viewDate: Date, increment: 0 | 1 | -1): Date {
    if (increment === 0) {
      return moment().toDate();
    }
    return moment(viewDate).add(increment, 'days').toDate();
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
