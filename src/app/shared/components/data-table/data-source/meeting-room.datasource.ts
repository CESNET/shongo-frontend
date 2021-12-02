import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { MeetingRoomService } from 'src/app/core/http/meeting-room/meeting-room.service';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Room } from 'src/app/shared/models/rest-api/room.interface';
import { DeleteButton } from '../buttons/delete-button';
import { EditButton } from '../buttons/edit-button';
import { TableButton } from '../models/table-button.interface';
import { TableColumn } from '../models/table-column.interface';
import { DataTableDataSource } from './data-table-datasource';

export class MeetingRoomDataSource extends DataTableDataSource<Room> {
  displayedColumns: TableColumn[];
  buttons: TableButton<Room>[];

  constructor(
    private _meetingRoomServie: MeetingRoomService,
    private _datePipe: DatePipe
  ) {
    super();

    this.displayedColumns = [
      { name: 'meetingRoom', displayName: 'Zasedací místnost' },
      {
        name: 'slotStart',
        displayName: 'Začátek slotu',
        pipeFunc: this.datePipe,
      },
      { name: 'slotEnd', displayName: 'Konec slotu', pipeFunc: this.datePipe },
      { name: 'state', displayName: 'Stav rezervace' },
      { name: 'description', displayName: 'Popis' },
    ];

    this.buttons = [
      new EditButton(),
      new DeleteButton(this._meetingRoomServie),
    ];
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<Room>> {
    return this._meetingRoomServie.fetchTableItems(
      pageSize,
      pageIndex,
      sortedColumn,
      sortDirection,
      filter
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