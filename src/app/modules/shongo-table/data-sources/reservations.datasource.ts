import { SortDirection } from '@angular/material/sort';
import { Observable, of } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ResourceReservation } from 'src/app/shared/models/rest-api/resource-utilization-detail.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { datePipeFunc } from 'src/app/utils/date-pipe-func';
import { RequestIdColumnComponent } from '../../resource-management/components/request-id-column/request-id-column.component';
import { ReservationOwnerColumnComponent } from '../../resource-management/components/reservation-owner-column/reservation-owner-column.component';
import { StaticDataSource } from './static-datasource';

export interface ResourceReservationTableData {
  id: string;
  requestId: string;
  slotStart: string;
  slotEnd: string;
  licenseCount: number;
  owner: string;
}

export class ReservationsDataSource extends StaticDataSource<
  ResourceReservationTableData,
  ResourceReservation
> {
  constructor(data: ResourceReservation[], private _datePipe: MomentDatePipe) {
    super(data);

    this.displayedColumns = [
      {
        name: 'id',
        displayName: $localize`:table column:Identifier`,
      },
      {
        name: 'licenseCount',
        displayName: $localize`:table column:Licences`,
      },
      {
        name: 'slotStart',
        displayName: $localize`:table column:Slot start`,
        pipeFunc: datePipeFunc.bind({ datePipe: this._datePipe }),
      },
      {
        name: 'slotEnd',
        displayName: $localize`:table column:Slot end`,
        pipeFunc: datePipeFunc.bind({ datePipe: this._datePipe }),
      },
      {
        name: 'requestId',
        displayName: $localize`:table column:Reservation request`,
        component: RequestIdColumnComponent,
      },
      {
        name: 'owner',
        displayName: $localize`:table column:Owner`,
        component: ReservationOwnerColumnComponent,
      },
    ];
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection
  ): Observable<ApiResponse<ResourceReservationTableData>> {
    const data = super.getFakeApiResponse(
      pageSize,
      pageIndex,
      sortedColumn,
      sortDirection
    );
    const items = data.items.map(
      (item: ResourceReservation) =>
        ({
          id: item.id,
          owner: JSON.stringify(item.user),
          requestId: item.requestId,
          slotStart: item.slot.start,
          slotEnd: item.slot.end,
          licenseCount: item.licenseCount,
        } as ResourceReservationTableData)
    );

    return of({ count: data.count, items });
  }
}
