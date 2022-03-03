import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ReservationRequestState } from 'src/app/models/enums/reservation-request-state.enum';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ReservationRequest } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { DeleteButton } from '../buttons/delete-button';
import { LinkButton } from '../buttons/link-button';
import { TableButton } from '../buttons/table-button';
import { RoomStateColumnComponent } from '../column-components/state-chip-column/components/room-state-column.component';
import { TableColumn } from '../models/table-column.interface';
import { DataTableDataSource } from './data-table-datasource';

interface CapacityRequestsTableData {
  id: string;
  slotStart: string;
  slotEnd: string;
  participantCount: number;
  state: ReservationRequestState;
  roomReservationRequestId: string;
}

export class CapacityRequestsDataSource extends DataTableDataSource<CapacityRequestsTableData> {
  displayedColumns: TableColumn[];
  buttons: TableButton[];

  constructor(
    public roomReservationRequestId: string,
    private _resReqService: ReservationRequestService,
    private _datePipe: DatePipe,
    private _dialog: MatDialog
  ) {
    super();

    this.displayedColumns = [
      {
        name: 'slotStart',
        displayName: 'Slot start',
        pipeFunc: this.datePipe,
      },
      { name: 'slotEnd', displayName: 'Slot end', pipeFunc: this.datePipe },
      { name: 'participantCount', displayName: 'Participant count' },
      {
        name: 'state',
        displayName: 'State',
        component: RoomStateColumnComponent,
      },
    ];

    this.buttons = [
      new LinkButton(
        'View reservation request',
        'visibility',
        '/reservation_request/:id'
      ),
      new DeleteButton(this._resReqService, this._dialog),
    ];
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<CapacityRequestsTableData>> {
    filter = filter.set(
      'roomReservationRequestId',
      this.roomReservationRequestId
    );

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
            slotStart: item.slot.start,
            slotEnd: item.slot.end,
            state: item.state,
            participantCount: item.roomCapacityData!.roomParticipantCount,
            roomReservationRequestId:
              item.roomCapacityData!.roomReservationRequestId,
          }));

          return { count, items: mappedItems };
        })
      );
  }

  datePipe = (value: unknown): string => {
    if (typeof value === 'string') {
      return this._datePipe.transform(value, 'medium') ?? 'Not a date';
    } else {
      throw new Error('Invalid column data type for date pipe.');
    }
  };
}
