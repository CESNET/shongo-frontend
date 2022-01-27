import { HttpParams } from '@angular/common/http';
import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Option } from 'src/app/models/interfaces/option.interface';
import { DataTableFilter } from 'src/app/shared/components/data-table/filter/data-table-filter';

@Component({
  selector: 'app-resource-capacity-utilization-filter',
  templateUrl: './resource-capacity-utilization-filter.component.html',
  styleUrls: ['./resource-capacity-utilization-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceCapacityUtilizationFilterComponent
  extends DataTableFilter
  implements OnInit, OnDestroy
{
  filterForm = new FormGroup({
    unit: new FormControl('day'),
    dateFrom: new FormControl(new Date(Date.now())),
    dateTo: new FormControl(new Date(Date.now())),
    useAbsoluteValues: new FormControl(false),
  });

  units: Option[] = [
    { value: 'day', displayName: 'Days' },
    { value: 'week', displayName: 'Weeks' },
    { value: 'month', displayName: 'Months' },
    { value: 'year', displayName: 'Years' },
  ];

  private _destroy$ = new Subject<void>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.emitHttpQuery();
    this.filterForm.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.emitHttpQuery());
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  getHttpQuery(): HttpParams {
    const { unit, dateFrom, dateTo } = this.filterForm.value as Record<
      string,
      string
    >;
    const params = new HttpParams()
      .set('unit', unit)
      .set('from', dateFrom)
      .set('to', dateTo);
    return params;
  }
}
