import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { ResourceCapacityUtilizationService } from 'src/app/core/http/resource-capacity-utilization/resource-capacity-utilization.service';
import { PercentageColumnComponent } from 'src/app/modules/resource-management/components/percentage-column/percentage-column.component';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ResourceCapacityUtilization } from 'src/app/shared/models/rest-api/resource-capacity-utilization.interface';
import { TableButton } from '../buttons/table-button';
import { TableColumn } from '../models/table-column.interface';
import { DataTableDataSource } from './data-table-datasource';

export class ResourceCapacityUtilizationDataSource extends DataTableDataSource<ResourceCapacityUtilization> {
  displayedColumns: TableColumn[];
  buttons: TableButton[] = [];

  constructor(
    private _resUtilService: ResourceCapacityUtilizationService,
    private _datePipe: DatePipe
  ) {
    super();

    this.displayedColumns = [
      { name: 'date', displayName: 'Date', pipeFunc: this.datePipe },
      {
        name: 'pexip',
        displayName: 'Pexip',
        component: PercentageColumnComponent,
      },
      {
        name: 'tcs2',
        displayName: 'tcs2',
        component: PercentageColumnComponent,
      },
      {
        name: 'connect-cesnet-new',
        displayName: 'connect-cesnet-new',
        component: PercentageColumnComponent,
      },
      {
        name: 'mcu-cesnet',
        displayName: 'mcu-cesnet',
        component: PercentageColumnComponent,
      },
      {
        name: 'mcu-muni',
        displayName: 'mcu-muni',
        component: PercentageColumnComponent,
      },
      {
        name: 'connect-cesnet-old',
        displayName: 'connect-cesnet-old',
        component: PercentageColumnComponent,
      },
      {
        name: 'freepbx-uvt',
        displayName: 'FreePBX-UVT',
        component: PercentageColumnComponent,
      },
    ];
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<ResourceCapacityUtilization>> {
    return this._resUtilService.fetchTableItems(
      pageSize,
      pageIndex,
      sortedColumn,
      sortDirection,
      filter
    );
  }

  datePipe = (value: unknown): string => {
    if (typeof value === 'string') {
      return this._datePipe.transform(value, 'fullDate') ?? 'Not a date';
    } else {
      throw new Error('Invalid column data type for date pipe.');
    }
  };
}
