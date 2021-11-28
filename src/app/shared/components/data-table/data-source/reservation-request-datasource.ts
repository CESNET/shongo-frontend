import { DatePipe } from '@angular/common';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ReservationRequest } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { DeleteButton } from '../buttons/delete-button';
import { EditButton } from '../buttons/edit-button';
import { TableButton } from '../models/table-button.interface';
import { TableColumn } from '../models/table-column.interface';
import { DataTableDataSource } from './data-table-datasource';

export class ReservationRequestDataSource extends DataTableDataSource<ReservationRequest> {
  displayedColumns: TableColumn[];
  buttons: TableButton<ReservationRequest>[];

  constructor(
    private _resReqService: ReservationRequestService,
    private _datePipe: DatePipe
  ) {
    super();

    this.displayedColumns = [
      { name: 'author', displayName: 'Autor' },
      {
        name: 'creationTime',
        displayName: 'Vytvořeno',
        pipeFunc: this.datePipe,
      },
      { name: 'name', displayName: 'Jméno' },
      { name: 'technology', displayName: 'Technologie' },
      {
        name: 'slotStart',
        displayName: 'Začátek slotu',
        pipeFunc: this.datePipe,
      },
      { name: 'slotEnd', displayName: 'Konec slotu', pipeFunc: this.datePipe },
      { name: 'state', displayName: 'Stav' },
    ];

    this.buttons = [new EditButton(), new DeleteButton(this._resReqService)];
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection
  ): Observable<ApiResponse<ReservationRequest>> {
    return this._resReqService.fetchItems();
  }

  datePipe = (value: unknown): string => {
    if (typeof value === 'string') {
      return this._datePipe.transform(value, 'medium') ?? 'Not a date';
    } else {
      throw new Error('Invalid column data type for date pipe.');
    }
  };
}
