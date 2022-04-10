import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ReservationRequestStateHelpComponent } from 'src/app/shared/components/state-help/wrapper-components/reservation-request-state-help.component';
import { ReservationRequestState } from 'src/app/shared/models/enums/reservation-request-state.enum';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ReservationRequest } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { datePipeFunc } from 'src/app/utils/datePipeFunc';
import { virtualRoomResourceConfig } from 'src/config/virtual-room-resource.config';
import { ReservationRequestFilterComponent } from '../../home/components/reservation-request-filter/reservation-request-filter.component';
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
  slotStart: number;
  slotEnd: number;
  state: string;
  isWritable: boolean;
}

export class YourRoomsDataSource extends DataTableDataSource<YourRoomsTableData> {
  filterComponent = ReservationRequestFilterComponent;

  constructor(
    public apiService: ReservationRequestService,
    private _datePipe: MomentDatePipe,
    private _dialog: MatDialog
  ) {
    super();

    this.displayedColumns = [
      { name: 'ownerName', displayName: $localize`:table column:Owner` },
      {
        name: 'createdAt',
        displayName: $localize`:table column:Created at`,
        pipeFunc: datePipeFunc.bind({ datePipe: this._datePipe }),
      },
      { name: 'roomName', displayName: $localize`:table column:Name` },
      {
        name: 'technology',
        displayName: $localize`:table column:Technology`,
        pipeFunc: (value) =>
          virtualRoomResourceConfig.technologyNameMap.get(
            value as Technology
          ) ?? $localize`:fallback text:Unknown`,
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
        name: 'state',
        displayName: $localize`:table column:State`,
        component: ReservationRequestStateColumnComponent,
        helpComponent: ReservationRequestStateHelpComponent,
      },
    ];

    this.buttons = [
      new LinkButton(
        $localize`:button name:View reservation request`,
        'visibility',
        '/reservation-request/:id'
      ),
      new LinkButton(
        $localize`:button name:Edit reservation request`,
        'settings',
        '/reservation-request/:id/edit',
        (row: YourRoomsTableData) =>
          !Boolean(row.isWritable) ||
          row.state === ReservationRequestState.ALLOCATED_FINISHED
      ),
      new DeleteButton(
        this.apiService,
        this._dialog,
        '/:id',
        (row: YourRoomsTableData) => !Boolean(row.isWritable)
      ),
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
            const {
              id,
              ownerName,
              createdAt,
              slot,
              virtualRoomData,
              state,
              isWritable,
            } = item;
            return {
              id,
              ownerName,
              createdAt,
              state,
              slotStart: slot.start,
              slotEnd: slot.end,
              roomName:
                virtualRoomData?.roomName ?? $localize`:fallback text:Unknown`,
              technology:
                virtualRoomData?.technology ??
                $localize`:fallback text:Unknown`,
              isWritable: isWritable,
            };
          });
          return { count, items: mappedItems };
        })
      );
  }
}
