import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ResourceUtilizationColumnComponent } from 'src/app/modules/resource-management/components/resource-utilization-column/resource-utilization-column.component';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ResourceCapacityUtilization } from 'src/app/shared/models/rest-api/resource-capacity-utilization.interface';
import { TableButton } from '../buttons/table-button';
import { TableColumn } from '../models/table-column.interface';
import { DataTableDataSource } from './data-table-datasource';

type Utilization = Omit<
  ResourceCapacityUtilizationTableData,
  'id' | 'interval'
>;

interface ResourceCapacityUtilizationTableData {
  id: string;
  interval: string;
  pexip: string;
  tcs2: string;
  'connect-cesnet-new': string;
  'mcu-cesnet': string;
  'mcu-muni': string;
  'connect-cesnet-old': string;
  'freepbx-uvt': string;
}

export class ResourceCapacityUtilizationDataSource extends DataTableDataSource<ResourceCapacityUtilizationTableData> {
  displayedColumns: TableColumn[];
  buttons: TableButton[] = [];

  constructor(
    private _resourceService: ResourceService,
    private _datePipe: DatePipe
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
            return { id: interval, interval, ...this.getUtilization(item) };
          });
          return { count: data.count, items };
        })
      );
  }

  getUtilization(item: ResourceCapacityUtilization): Utilization {
    const utilization: Record<string, string> = {};

    item.resources.forEach((resource) => {
      utilization[resource.name] = JSON.stringify({
        intervalFrom: item.intervalFrom,
        intervalTo: item.intervalTo,
        ...resource,
      });
    });

    return utilization as Utilization;
  }

  getInterval(item: ResourceCapacityUtilization): string {
    if (item.intervalFrom === item.intervalTo) {
      return this.datePipe(item.intervalFrom);
    }
    return `${this.datePipe(item.intervalFrom)} - ${this.datePipe(
      item.intervalTo
    )}`;
  }

  datePipe = (value: unknown): string => {
    if (typeof value === 'string') {
      return this._datePipe.transform(value, 'fullDate') ?? 'Not a date';
    } else {
      throw new Error('Invalid column data type for date pipe.');
    }
  };
}
