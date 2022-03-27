import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { toTitleCase } from 'src/app/utils/toTitleCase';
import { DeleteButton } from '../buttons/delete-button';
import { DataTableDataSource } from './data-table-datasource';

interface UserRolesTableData {
  identity: string;
  id: string;
  role: string;
  deletable: boolean;
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
        displayName: 'For user/group',
      },
      { name: 'role', displayName: 'Role' },
      {
        name: 'email',
        displayName: 'E-mail',
      },
    ];

    this.buttons = [
      new DeleteButton(
        this.resReqService,
        this.dialog,
        `/${this.requestId}/role/:id`,
        (row: UserRolesTableData) => row.deletable
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
            id: item.identityPrincipalId,
            identity: `${item.identityName} (${item.identityDescription})`,
            role: toTitleCase(item.role),
            deletable: item.deletable,
            email: item.email ?? '',
          }));
          return { count, items: mappedItems };
        })
      );
  }
}
