import { StaticDataSource } from './static-datasource';
import {
  ResourceReservation,
  ResourceReservationTableData,
} from 'src/app/shared/models/rest-api/resource-utilization-detail.interface';
import { TableButton } from '../buttons/table-button';
import { TableColumn } from '../models/table-column.interface';
import { DatePipe } from '@angular/common';
import { ReservationOwnerColumnComponent } from 'src/app/modules/resource-management/components/reservation-owner-column/reservation-owner-column.component';
import { SortDirection } from '@angular/material/sort';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';

export class ReservationsDataSource extends StaticDataSource<
  ResourceReservationTableData,
  ResourceReservation
> {
  buttons: TableButton[] = [];
  displayedColumns: TableColumn[];

  constructor(data: ResourceReservation[], private _datePipe: DatePipe) {
    super(data);

    this.displayedColumns = [
      {
        name: 'id',
        displayName: 'Identifier',
      },
      {
        name: 'licenceCount',
        displayName: 'Licences',
      },
      {
        name: 'slotStart',
        displayName: 'Slot start',
        pipeFunc: this.datePipe,
      },
      {
        name: 'slotEnd',
        displayName: 'Slot end',
        pipeFunc: this.datePipe,
      },
      {
        name: 'requestId',
        displayName: 'Reservation request',
      },
      {
        name: 'owner',
        displayName: 'Owner',
        component: ReservationOwnerColumnComponent,
      },
    ];
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<ResourceReservationTableData>> {
    const data = super.getFakeApiResponse(
      pageSize,
      pageIndex,
      sortedColumn,
      sortDirection,
      filter
    );
    const items = data.items.map(
      (item: ResourceReservation) =>
        ({
          id: item.id,
          owner: JSON.stringify(item.user),
          requestId: item.requestId,
          slotStart: item.slot.start,
          slotEnd: item.slot.end,
          licenceCount: item.licenceCount,
        } as ResourceReservationTableData)
    );

    return of({ count: data.count, items });
  }

  datePipe = (value: unknown): string => {
    if (typeof value === 'string') {
      return this._datePipe.transform(value, 'medium') ?? 'Not a date';
    } else {
      throw new Error('Invalid column data type for date pipe.');
    }
  };
}
