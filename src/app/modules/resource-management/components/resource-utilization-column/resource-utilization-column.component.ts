import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ColumnComponent,
  SETTINGS_PROVIDER,
  VALUE_PROVIDER,
} from 'src/app/shared/components/data-table/column-components/column.component';
import { TableSettings } from 'src/app/shared/components/data-table/filter/data-table-filter';

interface ColumnData {
  id: string;
  name: string;
  intervalFrom: string;
  intervalTo: string;
  totalCapacity: number;
  usedCapacity: number;
}

const BG_OPACITY = 0.6;

@Component({
  selector: 'app-resource-utilization-column',
  templateUrl: './resource-utilization-column.component.html',
  styleUrls: ['./resource-utilization-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceUtilizationColumnComponent
  extends ColumnComponent
  implements OnInit, OnDestroy
{
  columnData: ColumnData;
  percentage: number;
  useAbsoluteValue = false;

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(VALUE_PROVIDER) value: string,
    @Inject(SETTINGS_PROVIDER) settings: Observable<TableSettings>
  ) {
    super(value, settings);
    this.columnData = JSON.parse(value);
    this.percentage = this._getPercentage();
  }

  ngOnInit(): void {
    this.settings.pipe(takeUntil(this._destroy$)).subscribe((settings) => {
      this.useAbsoluteValue = settings.useAbsoluteValues as boolean;
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  getBgColor(): string {
    if (this.percentage < 0.1) {
      const all = 255 - 30 * this.percentage * 10;
      return `rgba(${all}, ${all}, ${all}, ${BG_OPACITY})`;
    } else {
      const green = 220 - 170 * this.percentage;
      return `rgba(255, ${green}, 50, ${BG_OPACITY})`;
    }
  }

  getQueryParams(): Record<string, string> {
    return {
      resourceId: this.columnData.id,
      intervalFrom: this.columnData.intervalFrom,
      intervalTo: this.columnData.intervalTo,
    };
  }

  private _getPercentage(): number {
    return this.columnData.usedCapacity / this.columnData.totalCapacity;
  }
}
