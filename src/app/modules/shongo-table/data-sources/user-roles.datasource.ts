import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { StringBool } from 'src/app/shared/models/types/string-bool.type';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { toTitleCase } from 'src/app/utils/to-title-case';
import { DeleteButton } from '../buttons/delete-button';
import { DataTableDataSource } from './data-table-datasource';

interface UserRolesTableData {
  identity: string;
  id: string;
  role: string;
  deletable: StringBool;
  email?: string;
}

export class UserRolesDataSource extends DataTableDataSource<UserRolesTableData> {
  constructor(
    public requestId: string,
    public resReqService: ReservationRequestService,
    public datePipe: MomentDatePipe,
    public dialog: MatDialog
  ) {
    super();

    this.displayedColumns = [
      {
        name: 'identity',
        displayName: $localize`:table column:For user/group`,
      },
      { name: 'role', displayName: $localize`:table column:Role` },
      {
        name: 'email',
        displayName: $localize`:table column:E-mail`,
      },
    ];

    this.buttons = [
      new DeleteButton(
        this.resReqService,
        this.dialog,
        `/${this.requestId}/roles/:id`,
        (row: UserRolesTableData) => row.deletable === 'false',
        undefined,
        this._deleteErrorHandler
      ),
    ];
  }

  getData(
    pageSize: number,
    pageIndex: number
  ): Observable<ApiResponse<UserRolesTableData>> {
    return this.resReqService
      .fetchUserRoles(pageSize, pageIndex, this.requestId)
      .pipe(
        map((tableData) => {
          const { count, items } = tableData;
          const mappedItems = items.map((item) => ({
            id: item.id,
            identity:
              item.identityName +
              (item.identityDescription
                ? ` (${item.identityDescription})`
                : ''),
            role: toTitleCase(item.role),
            deletable: String(item.deletable) as StringBool,
            email: item.email ?? '',
          }));
          return { count, items: mappedItems };
        })
      );
  }

  private _deleteErrorHandler(err: Error): void {
    if (err instanceof HttpErrorResponse && err.status === 403) {
      throw Error(
        $localize`:error message:Reservation must have at least 1 owner`
      );
    }
  }
}
