import { HttpParams } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ResourceUtilizationColumnComponent } from 'src/app/modules/resource-management/components/resource-utilization-column/resource-utilization-column.component';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ResourceCapacityUtilization } from 'src/app/shared/models/rest-api/resource-capacity-utilization.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { datePipeFunc } from 'src/app/utils/date-pipe-func';
import { ResourceCapacityUtilizationFilterComponent } from '../../resource-management/components/resource-capacity-utilization-filter/resource-capacity-utilization-filter.component';
import { TableColumn } from '../models/table-column.interface';
import { DataTableDataSource } from './data-table-datasource';

export interface ResourceCapacityUtilizationTableData {
  intervalFrom: string;
  intervalTo: string;
  interval: string;
}

export class ResourceCapacityUtilizationDataSource extends DataTableDataSource<ResourceCapacityUtilizationTableData> {
  filterComponent = ResourceCapacityUtilizationFilterComponent;
  useHttpRefreshParam = true;

  constructor(
    private _resourceService: ResourceService,
    private _datePipe: MomentDatePipe,
    private _resourceNames: string[]
  ) {
    super();
    this.displayedColumns = this._buildDisplayedColumns();
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<ResourceCapacityUtilizationTableData>> {
    return this._resourceService
      .fetchCapacityUtilization(
        pageSize,
        pageIndex,
        sortedColumn,
        sortDirection,
        filter
      )
      .pipe(
        map((data) => {
          const items = data.items.map((item: ResourceCapacityUtilization) => {
            const interval = this.getInterval(item);
            const { start: intervalFrom, end: intervalTo } = item.interval;
            return {
              intervalFrom,
              intervalTo,
              interval,
              ...this.getUtilization(item),
            };
          });
          return { count: data.count, items };
        })
      );
  }

  getUtilization(item: ResourceCapacityUtilization): Record<string, string> {
    const utilization: Record<string, string> = {};

    item.resources.forEach((resource) => {
      utilization[resource.name] = JSON.stringify(resource);
    });

    return utilization;
  }

  getInterval(item: ResourceCapacityUtilization): string {
    if (item.interval.start === item.interval.end) {
      return this.datePipeFunc(item.interval.start);
    }
    return `${this.datePipeFunc(item.interval.start)} - ${this.datePipeFunc(
      item.interval.end
    )}`;
  }

  datePipeFunc = datePipeFunc.bind({ datePipe: this._datePipe });

  private _buildDisplayedColumns(): TableColumn<ResourceCapacityUtilizationTableData>[] {
    const columns: TableColumn<ResourceCapacityUtilizationTableData>[] = [
      {
        name: 'interval',
        displayName: $localize`:table column name:Interval`,
      },
    ];

    this._resourceNames.forEach((resource) => {
      columns.push({
        name: resource,
        displayName: resource,
        component: ResourceUtilizationColumnComponent,
      });
    });

    return columns;
  }
}
