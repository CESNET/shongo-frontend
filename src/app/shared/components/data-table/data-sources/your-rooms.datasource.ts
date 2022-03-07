import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ReservationType } from 'src/app/models/enums/reservation-type.enum';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ReservationRequest } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { datePipeFunc } from 'src/app/utils/datePipeFunc';
import { DeleteButton } from '../buttons/delete-button';
import { LinkButton } from '../buttons/link-button';
import { TableButton } from '../buttons/table-button';
import { ReservationRequestStateColumnComponent } from '../column-components/state-chip-column/components/reservation-request-state-column.component';
import { TableColumn } from '../models/table-column.interface';
import { DataTableDataSource } from './data-table-datasource';

export interface YourRoomsTableData {
  id: string;
  ownerName: string;
  createdAt: string;
  roomName: string;
  technology: string;
  slotStart: string;
  slotEnd: string;
  state: string;
}

export class YourRoomsDataSource extends DataTableDataSource<YourRoomsTableData> {
  displayedColumns: TableColumn[];
  buttons: TableButton<YourRoomsTableData>[];

  constructor(
    private _resReqService: ReservationRequestService,
    private _datePipe: DatePipe,
    private _dialog: MatDialog
  ) {
    super();

    this.displayedColumns = [
      { name: 'ownerName', displayName: 'Owner' },
      {
        name: 'createdAt',
        displayName: 'Created at',
        pipeFunc: datePipeFunc.bind({ datePipe: this._datePipe }),
      },
      { name: 'roomName', displayName: 'Name' },
      { name: 'technology', displayName: 'Technology' },
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
        displayName: 'State',
        component: ReservationRequestStateColumnComponent,
      },
    ];

    this.buttons = [
      new LinkButton('Show detail', 'visibility', '/reservation-request/:id'),
      new LinkButton(
        'Edit reservation request',
        'settings',
        '/reservation-request/edit/:id'
      ),
      new DeleteButton(this._resReqService, this._dialog, '/:id'),
    ];
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<YourRoomsTableData>> {
    filter = filter.set('type', ReservationType.VIRTUAL_ROOM);
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
          const mappedItems = items.map((item: ReservationRequest) => {
            const { id, ownerName, createdAt, slot, virtualRoomData, state } =
              item;
            return {
              id,
              ownerName,
              createdAt,
              state,
              slotStart: slot.start,
              slotEnd: slot.end,
              roomName: virtualRoomData?.roomName ?? 'unknown',
              technology: virtualRoomData?.technology ?? 'unknown',
            };
          });
          return { count, items: mappedItems };
        })
      );
  }
}