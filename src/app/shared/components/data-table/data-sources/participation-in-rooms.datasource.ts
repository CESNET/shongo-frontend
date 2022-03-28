import { HttpParams } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoomService } from 'src/app/core/http/room/room.service';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Room } from 'src/app/shared/models/rest-api/room.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { datePipeFunc } from 'src/app/utils/datePipeFunc';
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
      { name: 'name', displayName: 'Name' },
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
        component: RoomStateColumnComponent,
      },
      { name: 'description', displayName: 'Description' },
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
