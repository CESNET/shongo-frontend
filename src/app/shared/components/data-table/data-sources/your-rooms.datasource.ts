import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ReservationRequest } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { datePipeFunc } from 'src/app/utils/datePipeFunc';
import { virtualRoomResourceConfig } from 'src/config/virtual-room-resource.config';
import { DeleteButton } from '../buttons/delete-button';
import { LinkButton } from '../buttons/link-button';
import { ReservationRequestStateColumnComponent } from '../column-components/state-chip-column/components/reservation-request-state-column.component';
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
  constructor(
    public apiService: ReservationRequestService,
    private _datePipe: MomentDatePipe,
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
      {
        name: 'technology',
        displayName: 'Technology',
        pipeFunc: (value) =>
          virtualRoomResourceConfig.tagNameMap.get(value as Technology) ??
          'Unknown',
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
        name: 'state',
        displayName: 'State',
        component: ReservationRequestStateColumnComponent,
      },
    ];

    this.buttons = [
      new LinkButton(
        'View reservation request',
        'visibility',
        '/reservation-request/:id'
      ),
      new LinkButton(
        'Edit reservation request',
        'settings',
        '/reservation-request/edit/:id'
      ),
      new DeleteButton(this.apiService, this._dialog, '/:id'),
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
    return this.apiService
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
