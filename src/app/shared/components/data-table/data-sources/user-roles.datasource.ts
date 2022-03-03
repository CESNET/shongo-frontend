import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Role } from 'src/app/shared/models/rest-api/role.interface';
import { toTitleCase } from 'src/app/utils/toTitleCase';
import { DeleteButton } from '../buttons/delete-button';
import { LinkButton } from '../buttons/link-button';
import { TableButton } from '../buttons/table-button';
import { TableColumn } from '../models/table-column.interface';
import { DataTableDataSource } from './data-table-datasource';

interface UserRolesTableData {
  identity: string;
  role: string;
  email?: string;
}

export class UserRolesDataSource extends DataTableDataSource<UserRolesTableData> {
  displayedColumns: TableColumn[];
  buttons: TableButton[];

  constructor(
    public requestId: string,
    private _resReqService: ReservationRequestService,
    private _datePipe: DatePipe,
    private _dialog: MatDialog
  ) {
    super();

    this.displayedColumns = [
      {
        name: 'identity',
        displayName: 'For user/group',
      },
      { name: 'role', displayName: 'Role' },
      {
        name: 'email',
        displayName: 'E-mail',
      },
    ];

    this.buttons = [];
  }

  getData(
    pageSize: number,
    pageIndex: number
  ): Observable<ApiResponse<UserRolesTableData>> {
    return this._resReqService
      .fetchUserRoles(pageSize, pageIndex, this.requestId)
      .pipe(
        map((tableData) => {
          const { count, items } = tableData;
          const mappedItems = items.map((item) => ({
            identity: `${item.identityName} (${item.identityDescription})`,
            role: toTitleCase(item.role),
            email: item.email ?? '',
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
