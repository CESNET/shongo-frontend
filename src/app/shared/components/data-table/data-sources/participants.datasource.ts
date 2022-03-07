import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ParticipantRole } from 'src/app/shared/models/enums/participant-role.enum';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { toTitleCase } from 'src/app/utils/toTitleCase';
import { DeleteButton } from '../buttons/delete-button';
import { TableButton } from '../buttons/table-button';
import { TableColumn } from '../models/table-column.interface';
import { DataTableDataSource } from './data-table-datasource';

interface ParticipantsTableData {
  id: string;
  identity: string;
  role: ParticipantRole;
  email: string;
}

export class ParticipantsDataSource extends DataTableDataSource<ParticipantsTableData> {
  displayedColumns: TableColumn[];
  buttons: TableButton<ParticipantsTableData>[];

  constructor(
    private _resReqService: ReservationRequestService,
    private _datePipe: DatePipe,
    private _dialog: MatDialog,
    public requestId: string
  ) {
    super();

    this.displayedColumns = [
      { name: 'identity', displayName: 'User' },
      {
        name: 'role',
        displayName: 'Role',
        pipeFunc: (value: unknown) => toTitleCase(value as ParticipantRole),
      },
      { name: 'email', displayName: 'E-mail' },
    ];

    this.buttons = [
      new DeleteButton(
        this._resReqService,
        this._dialog,
        `/${requestId}/participant/:id`
      ),
    ];
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<ParticipantsTableData>> {
    return this._resReqService
      .fetchParticipants(pageSize, pageIndex, this.requestId)
      .pipe(
        map((tableData) => {
          const { count, items } = tableData;
          const mappedItems = items.map((item) => ({
            id: item.id,
            identity: `${item.name} (${item.organization})`,
            role: item.role,
            email: item.email,
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
