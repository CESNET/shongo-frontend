import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ReservationRequest } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { datePipeFunc } from 'src/app/utils/datePipeFunc';
import { DeleteButton } from '../buttons/delete-button';
import { LinkButton } from '../buttons/link-button';
import { ReservationRequestStateColumnComponent } from '../column-components/state-chip-column/components/reservation-request-state-column.component';
import { DataTableDataSource } from './data-table-datasource';

interface PhysicalReservationsTableData {
  id: string;
  resourceName: string;
  slotStart: string;
  slotEnd: string;
  state: string;
  resourceDescription: string;
}

export class PhysicalReservationsDataSource extends DataTableDataSource<PhysicalReservationsTableData> {
  constructor(
    private _resReqService: ReservationRequestService,
    private _datePipe: MomentDatePipe,
    private _dialog: MatDialog
  ) {
    super();

    this.displayedColumns = [
      { name: 'resourceName', displayName: 'Meeting room' },
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
        name: 'state',
        displayName: 'Reservation state',
        component: ReservationRequestStateColumnComponent,
      },
      { name: 'resourceDescription', displayName: 'Description' },
    ];

    this.buttons = [
      new LinkButton(
        'View reservation request',
        'visibility',
        '/reservation-request/:id'
      ),
      new LinkButton('Edit meeting room', 'settings', '/meeting_room/:id'),
      new DeleteButton(this._resReqService, this._dialog, '/:id'),
    ];
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<PhysicalReservationsTableData>> {
    filter = filter.set('type', ReservationType.PHYSICAL_RESOURCE);
    return this._resReqService
      .fetchTableItems<ReservationRequest>(
        pageSize,
        pageIndex,
        sortedColumn,
        sortDirection,
        filter
      )
      .pipe(
        map((tableData) => {
          const { count, items } = tableData;
          const mappedItems = items.map((item) => ({
            id: item.id,
            resourceName: item?.physicalResourceData?.resourceName ?? 'unknown',
            slotStart: item.slot.start,
            slotEnd: item.slot.end,
            state: item.state,
            resourceDescription:
              item?.physicalResourceData?.resourceDescription ?? 'unknown',
          }));

          return { count, items: mappedItems };
        })
      );
  }
}
