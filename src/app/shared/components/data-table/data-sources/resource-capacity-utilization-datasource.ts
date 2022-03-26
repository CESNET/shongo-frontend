import { HttpParams } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ResourceUtilizationColumnComponent } from 'src/app/modules/resource-management/components/resource-utilization-column/resource-utilization-column.component';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ResourceCapacityUtilization } from 'src/app/shared/models/rest-api/resource-capacity-utilization.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { datePipeFunc } from 'src/app/utils/datePipeFunc';
import { TableButton } from '../buttons/table-button';
import { TableColumn } from '../models/table-column.interface';
import { DataTableDataSource } from './data-table-datasource';

export interface Utilization {
  pexip: string;
  tcs2: string;
  'connect-cesnet-new': string;
  'mcu-cesnet': string;
  'mcu-muni': string;
  'connect-cesnet-old': string;
  'freepbx-uvt': string;
}

export interface ResourceCapacityUtilizationTableData extends Utilization {
  intervalFrom: string;
  intervalTo: string;
  interval: string;
}

export class ResourceCapacityUtilizationDataSource extends DataTableDataSource<ResourceCapacityUtilizationTableData> {
  displayedColumns: TableColumn<ResourceCapacityUtilizationTableData>[];
  buttons: TableButton<ResourceCapacityUtilizationTableData>[] = [];

  constructor(
    private _resourceService: ResourceService,
    private _datePipe: MomentDatePipe
  ) {
    super();

    this.displayedColumns = [
      { name: 'interval', displayName: 'Interval' },
      {
        name: 'Pexip',
        displayName: 'Pexip',
        component: ResourceUtilizationColumnComponent,
      },
      {
        name: 'tcs2',
        displayName: 'tcs2',
        component: ResourceUtilizationColumnComponent,
      },
      {
        name: 'connect-cesnet-new',
        displayName: 'connect-cesnet-new',
        component: ResourceUtilizationColumnComponent,
      },
      {
        name: 'mcu-cesnet',
        displayName: 'mcu-cesnet',
        component: ResourceUtilizationColumnComponent,
      },
      {
        name: 'mcu-muni',
        displayName: 'mcu-muni',
        component: ResourceUtilizationColumnComponent,
      },
      {
        name: 'connect-cesnet-old',
        displayName: 'connect-cesnet-old',
        component: ResourceUtilizationColumnComponent,
      },
      {
        name: 'FreePBX-UVT',
        displayName: 'FreePBX-UVT',
        component: ResourceUtilizationColumnComponent,
      },
    ];
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
            const { intervalFrom, intervalTo } = item;
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

  getUtilization(item: ResourceCapacityUtilization): Utilization {
    const utilization: Record<string, string> = {};

    item.resources.forEach((resource) => {
      utilization[resource.name] = JSON.stringify(resource);
    });

    return utilization as unknown as Utilization;
  }

  getInterval(item: ResourceCapacityUtilization): string {
    if (item.intervalFrom === item.intervalTo) {
      return this.datePipeFunc(Number(item.intervalFrom));
    }
    return `${this.datePipeFunc(
      Number(item.intervalFrom)
    )} - ${this.datePipeFunc(Number(item.intervalTo))}`;
  }

  datePipeFunc = datePipeFunc.bind({ datePipe: this._datePipe });
}
