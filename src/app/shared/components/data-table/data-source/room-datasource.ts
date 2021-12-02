import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { RoomService } from 'src/app/core/http/room/room.service';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Room } from 'src/app/shared/models/rest-api/room.interface';
import { EditButton } from '../buttons/edit-button';
import { TableButton } from '../models/table-button.interface';
import { TableColumn } from '../models/table-column.interface';
import { DataTableDataSource } from './data-table-datasource';

export class RoomDataSource extends DataTableDataSource<Room> {
  displayedColumns: TableColumn[];
  buttons: TableButton<Room>[];

  constructor(private _roomService: RoomService, private _datePipe: DatePipe) {
    super();

    this.displayedColumns = [
      { name: 'name', displayName: 'Jméno' },
      { name: 'technology', displayName: 'Technologie' },
      {
        name: 'slotStart',
        displayName: 'Začátek slotu',
        pipeFunc: this.datePipe,
      },
      { name: 'slotEnd', displayName: 'Konec slotu', pipeFunc: this.datePipe },
      { name: 'state', displayName: 'Stav' },
      { name: 'description', displayName: 'Popis' },
    ];

    this.buttons = [new EditButton()];
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<Room>> {
    return this._roomService.fetchTableItems(
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