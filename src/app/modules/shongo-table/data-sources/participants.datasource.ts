import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ParticipantRole } from 'src/app/shared/models/enums/participant-role.enum';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { toTitleCase } from 'src/app/utils/toTitleCase';
import { DeleteButton } from '../buttons/delete-button';
import { DataTableDataSource } from './data-table-datasource';

interface ParticipantsTableData {
  id: string;
  identity: string;
  role: ParticipantRole;
  email: string;
}

export class ParticipantsDataSource extends DataTableDataSource<ParticipantsTableData> {
  constructor(
    private _resReqService: ReservationRequestService,
    private _dialog: MatDialog,
    public requestId: string
  ) {
    super();

    this.displayedColumns = [
      { name: 'identity', displayName: $localize`:table column:User` },
      {
        name: 'role',
        displayName: $localize`:table column:Role`,
        pipeFunc: (value: unknown) => toTitleCase(value as ParticipantRole),
      },
      { name: 'email', displayName: $localize`:table column:E-mail` },
    ];

    this.buttons = [
      new DeleteButton(
        this._resReqService,
        this._dialog,
        `/${requestId}/participants/:id`
      ),
    ];
  }

  getData(
    pageSize: number,
    pageIndex: number
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
}
