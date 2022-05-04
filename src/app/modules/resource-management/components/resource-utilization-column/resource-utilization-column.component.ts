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
  COL_DATA_PROVIDER,
  SETTINGS_PROVIDER,
} from 'src/app/modules/shongo-table/column-components/column.component';
import { ResourceCapacityUtilizationTableData } from 'src/app/modules/shongo-table/data-sources/resource-capacity-utilization-datasource';
import { TableSettings } from 'src/app/modules/shongo-table/filter/data-table-filter';
import { ColumnData } from 'src/app/modules/shongo-table/models/interfaces/column-data.interface';

/**
 * Background opacity, alpha value for RGBA.
 */
const BG_OPACITY = 0.6;

interface ResourceUtilization {
  id: string;
  name: string;
  totalCapacity: string;
  usedCapacity: string;
}

/**
 * Resource utilization column component colored based on utilization ratio.
 */
@Component({
  selector: 'app-resource-utilization-column',
  templateUrl: './resource-utilization-column.component.html',
  styleUrls: ['./resource-utilization-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceUtilizationColumnComponent
  extends ColumnComponent<ResourceCapacityUtilizationTableData>
  implements OnInit, OnDestroy
{
  percentage: number;
  useAbsoluteValue = false;

  private readonly _destroy$ = new Subject<void>();

  constructor(
    @Inject(COL_DATA_PROVIDER)
    public columnData: ColumnData<ResourceCapacityUtilizationTableData>,
    @Inject(SETTINGS_PROVIDER) settings: Observable<TableSettings>
  ) {
    super(columnData, settings);
    this.percentage = this._getPercentage();
  }

  get cellData(): ResourceUtilization {
    return JSON.parse(
      this.columnData.row[this.columnData.columnName]
    ) as ResourceUtilization;
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

  /**
   * Returns cell background color.
   *
   * - Shades of gray for percentages < 0.1;
   * - Color on scale from yellow to red for the rest.
   *
   * @returns RGBA color.
   */
  getBgColor(): string {
    if (this.percentage < 0.1) {
      const all = 255 - 30 * this.percentage * 10;
      return `rgba(${all}, ${all}, ${all}, ${BG_OPACITY})`;
    } else {
      const green = 220 - 170 * this.percentage;
      return `rgba(255, ${green}, 50, ${BG_OPACITY})`;
    }
  }

  /**
   * Gets query parameters needed for resource utilization
   * detail page to fetch the same data that this column represents.
   *
   * @returns Query parameters.
   */
  getQueryParams(): Record<string, string> {
    return {
      resource_id: this.cellData.id,
      interval_from: this.columnData.row.intervalFrom,
      interval_to: this.columnData.row.intervalTo,
    };
  }

  /**
   * Returns percentage of capacity used for the resource.
   *
   * @returns Percentage.
   */
  private _getPercentage(): number {
    return (
      Number(this.cellData.usedCapacity) / Number(this.cellData.totalCapacity)
    );
  }
}
