import { Observable, throwError } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ApiActionButton } from 'src/app/modules/shongo-table/buttons/api-action-button';
import { RowPredicate } from 'src/app/modules/shongo-table/buttons/table-button';
import { RuntimeParticipantTableData } from 'src/app/modules/shongo-table/data-sources/runtime-management.datasource';

export class DisconnectUserButton extends ApiActionButton<RuntimeParticipantTableData> {
  icon = 'person_off';
  name = $localize`:button name:Disconnect user`;

  constructor(
    public resReqService: ReservationRequestService,
    public requestId: string,
    public isDisabledFunc?: RowPredicate<RuntimeParticipantTableData>,
    public displayButtonFunc?: RowPredicate<RuntimeParticipantTableData>
  ) {
    super(isDisabledFunc, displayButtonFunc);
  }

  executeAction(row: RuntimeParticipantTableData): Observable<string> {
    this.addToLoading(row);

    return this.resReqService.disconnectUser(this.requestId, row.id).pipe(
      tap(() => {
        this.removeFromLoading(row);
        this._deleted$.next(row);
      }),
      mapTo($localize`:success message:User disconnected`),
      catchError(() => {
        this.removeFromLoading(row);
        return throwError($localize`:error message:Failed to disconnect user`);
      })
    );
  }
}
