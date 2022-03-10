import { StaticDataSource } from './static-datasource';
import {
  ResourceReservation,
  ResourceReservationTableData,
} from 'src/app/shared/models/rest-api/resource-utilization-detail.interface';
import { DatePipe } from '@angular/common';
import { ReservationOwnerColumnComponent } from 'src/app/modules/resource-management/components/reservation-owner-column/reservation-owner-column.component';
import { SortDirection } from '@angular/material/sort';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { datePipeFunc } from 'src/app/utils/datePipeFunc';

export class ReservationsDataSource extends StaticDataSource<
  ResourceReservationTableData,
  ResourceReservation
> {
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
        pipeFunc: datePipeFunc.bind({ datePipe: this._datePipe }),
      },
      {
        name: 'slotEnd',
        displayName: 'Slot end',
        pipeFunc: datePipeFunc.bind({ datePipe: this._datePipe }),
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
}
