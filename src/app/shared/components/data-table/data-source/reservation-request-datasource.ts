import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { RoomStateColumnComponent } from 'src/app/modules/home/components/room-state-column/room-state-column.component';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ReservationRequest } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { DeleteButton } from '../buttons/delete-button';
import { LinkButton } from '../buttons/link-button';
import { TableButton } from '../buttons/table-button';
import { TableColumn } from '../models/table-column.interface';
import { DataTableDataSource } from './data-table-datasource';

export class ReservationRequestDataSource extends DataTableDataSource<ReservationRequest> {
  displayedColumns: TableColumn[];
  buttons: TableButton[];

  constructor(
    private _resReqService: ReservationRequestService,
    private _datePipe: DatePipe,
    private _dialog: MatDialog
  ) {
    super();

    this.displayedColumns = [
      { name: 'author', displayName: 'Author' },
      {
        name: 'creationTime',
        displayName: 'Created at',
        pipeFunc: this.datePipe,
      },
      { name: 'name', displayName: 'Name' },
      { name: 'technology', displayName: 'Technology' },
      {
        name: 'slotStart',
        displayName: 'Slot start',
        pipeFunc: this.datePipe,
      },
      { name: 'slotEnd', displayName: 'Slot end', pipeFunc: this.datePipe },
      {
        name: 'state',
        displayName: 'State',
        component: RoomStateColumnComponent,
      },
    ];

    this.buttons = [
      new LinkButton(
        'Edit reservation request',
        'settings',
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
  ): Observable<ApiResponse<ReservationRequest>> {
    return this._resReqService.fetchTableItems(
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
