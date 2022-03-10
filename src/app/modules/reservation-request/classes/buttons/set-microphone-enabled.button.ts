import { Observable, throwError } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ApiActionButton } from 'src/app/shared/components/data-table/buttons/api-action-button';
import { RowPredicate } from 'src/app/shared/components/data-table/buttons/table-button';
import { RuntimeParticipantTableData } from 'src/app/shared/components/data-table/data-sources/runtime-management.datasource';

export class SetMicrophoneEnabledButton extends ApiActionButton<RuntimeParticipantTableData> {
  icon: string;
  name: string;

  constructor(
    public resReqService: ReservationRequestService,
    public requestId: string,
    public enableMicrophone: boolean,
    public isDisabledFunc?: RowPredicate<RuntimeParticipantTableData>,
    public displayButtonFunc?: RowPredicate<RuntimeParticipantTableData>
  ) {
    super(isDisabledFunc, displayButtonFunc);

    if (enableMicrophone) {
      this.icon = 'mic';
      this.name = 'Unmute user';
    } else {
      this.icon = 'mic_off';
      this.name = 'Mute user';
    }
  }

  executeAction(row: RuntimeParticipantTableData): Observable<string> {
    this.addToLoading(row);

    const action = this.enableMicrophone ? 'unmuted' : 'muted';

    return this.resReqService
      .setParticipantMicrophoneEnabled(
        this.requestId,
        row.id,
        this.enableMicrophone
      )
      .pipe(
        tap(() => {
          this.removeFromLoading(row);
        }),
        mapTo(`User ${action} successfully.`),
        catchError(() => {
          this.removeFromLoading(row);
          return throwError(`Failed to ${action} user.`);
        })
      );
  }
}
