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
import { Option } from 'src/app/shared/models/interfaces/option.interface';
import * as moment from 'moment';
import {
  DataTableFilter,
  TableSettings,
} from 'src/app/modules/shongo-table/filter/data-table-filter';
import { TimeUnit } from 'src/app/shared/models/enums/time-unit.enum';

const DEFAULT_UNIT_DIST = 5;

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
  readonly filterForm = new FormGroup({
    unit: new FormControl(TimeUnit.DAY),
    dateFrom: new FormControl(),
    dateTo: new FormControl(),
  });
  readonly useAbsoluteValues = new FormControl(false);

  readonly units: Option[] = [
    { value: TimeUnit.DAY, displayName: $localize`:unit option:Days` },
    { value: TimeUnit.WEEK, displayName: $localize`:unit option:Weeks` },
    { value: TimeUnit.MONTH, displayName: $localize`:unit option:Months` },
    { value: TimeUnit.YEAR, displayName: $localize`:unit option:Years` },
  ];

  private _destroy$ = new Subject<void>();

  constructor() {
    super();

    const currentDate = moment().toDate();
    this.filterForm.get('dateFrom')!.setValue(currentDate);
    this.filterForm
      .get('dateTo')!
      .setValue(moment(currentDate).add(DEFAULT_UNIT_DIST, 'day').toDate());
  }

  ngOnInit(): void {
    this.emitHttpQuery();
    this.filterForm.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.emitHttpQuery();
      });

    this.useAbsoluteValues.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.emitSettings();
      });

    this.filterForm
      .get('unit')!
      .valueChanges.pipe(takeUntil(this._destroy$))
      .subscribe((unit) => {
        const { dateFrom } = this.filterForm.value;
        this.filterForm
          .get('dateTo')!
          .setValue(moment(dateFrom).add(DEFAULT_UNIT_DIST, unit).toDate());
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Getts HTTP query params based on form state.
   *
   * @returns HTTP query parameters.
   */
  getHttpQuery(): HttpParams {
    const { unit, dateFrom, dateTo } = this.filterForm.value as Record<
      string,
      string
    >;
    const params = new HttpParams()
      .set('unit', unit)
      .set('interval_from', moment(dateFrom).toISOString())
      .set('interval_to', moment(dateTo).toISOString());
    return params;
  }

  /**
   * Returns table settings record.
   *
   * @returns Table settings.
   */
  getTableSettings(): TableSettings {
    const useAbsoluteValues = this.useAbsoluteValues.value;
    return { useAbsoluteValues };
  }
}
