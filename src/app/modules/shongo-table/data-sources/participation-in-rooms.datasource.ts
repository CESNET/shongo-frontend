import { HttpParams } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoomService } from 'src/app/core/http/room/room.service';
import { RoomStateHelpComponent } from 'src/app/shared/components/state-help/wrapper-components/room-state-help.component';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Room } from 'src/app/shared/models/rest-api/room.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { datePipeFunc } from 'src/app/utils/date-pipe-func';
import { virtualRoomResourceConfig } from 'src/config/virtual-room-resource.config';
import { RoomStateColumnComponent } from '../column-components/state-chip-column/components/room-state-column.component';
import { DataTableDataSource } from './data-table-datasource';

interface ParticipationInRoomsTableData {
  id: string;
  name: string;
  technology: string;
  slotStart: string;
  slotEnd: string;
  description: string;
  state: string;
}

export class ParticipationInRoomsDataSource extends DataTableDataSource<ParticipationInRoomsTableData> {
  constructor(
    private _roomService: RoomService,
    private _datePipe: MomentDatePipe
  ) {
    super();

    this.displayedColumns = [
      {
        name: 'name',
        displayName: $localize`:table column:Name`,
      },
      {
        name: 'technology',
        displayName: $localize`:table column:Technology`,
        pipeFunc: (value) =>
          virtualRoomResourceConfig.technologyNameMap.get(
            value as Technology
          ) ?? `:fallback text:Unknown`,
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
        component: RoomStateColumnComponent,
        helpComponent: RoomStateHelpComponent,
        sortBy: 'STATE',
      },
      {
        name: 'description',
        displayName: $localize`:table column:Description`,
      },
    ];

    this.buttons = [];
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<ParticipationInRoomsTableData>> {
    return this._roomService
      .fetchTableItems<Room>(
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
            name: item.name,
            technology: item.technology,
            slotStart: item.slot.start,
            slotEnd: item.slot.end,
            state: item.state,
            description: item.description,
          }));

          return { count, items: mappedItems };
        })
      );
  }
}
