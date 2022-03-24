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
import { Resource, resources } from 'src/app/models/data/resources';

@Component({
  selector: 'app-reservation-calendar-tab',
  templateUrl: './reservation-calendar-tab.component.html',
  styleUrls: ['./reservation-calendar-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationCalendarTabComponent implements OnInit, OnDestroy {
  selectedResourceId?: string;
  filteredResources: Resource[];

  readonly resources = resources;
  readonly filterGroup = new FormGroup({
    resource: new FormControl(this.resources[0].id),
    highlightMine: new FormControl(false),
    resourceFilter: new FormControl(''),
  });

  readonly CalendarView = CalendarView;
  private readonly _destroy$ = new Subject<void>();

  constructor() {
    this.filteredResources = this.resources;
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
      return new Date();
    }
    return moment(viewDate).add(increment, 'days').toDate();
  }

  private _filterResources(filter: string): void {
    this.filteredResources = this.resources.filter((resource) =>
      resource.name.toLowerCase().includes(filter.toLowerCase())
    );
  }
}
