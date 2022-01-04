import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { MeetingRoomService } from 'src/app/core/http/meeting-room/meeting-room.service';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Room } from 'src/app/shared/models/rest-api/room.interface';
import { DeleteButton } from '../buttons/delete-button';
import { LinkButton } from '../buttons/link-button';
import { TableButton } from '../buttons/table-button';
import { TableColumn } from '../models/table-column.interface';
import { DataTableDataSource } from './data-table-datasource';

export class MeetingRoomDataSource extends DataTableDataSource<Room> {
  displayedColumns: TableColumn[];
  buttons: TableButton[];

  constructor(
    private _meetingRoomServie: MeetingRoomService,
    private _datePipe: DatePipe,
    private _dialog: MatDialog
  ) {
    super();

    this.displayedColumns = [
      { name: 'meetingRoom', displayName: 'Meeting room' },
      {
        name: 'slotStart',
        displayName: 'Slot start',
        pipeFunc: this.datePipe,
      },
      { name: 'slotEnd', displayName: 'Slot end', pipeFunc: this.datePipe },
      { name: 'state', displayName: 'Reservation state' },
      { name: 'description', displayName: 'Description' },
    ];

    this.buttons = [
      new LinkButton('Edit meeting room', 'settings', '/meeting_room/:id'),
      new DeleteButton(this._meetingRoomServie, this._dialog),
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
