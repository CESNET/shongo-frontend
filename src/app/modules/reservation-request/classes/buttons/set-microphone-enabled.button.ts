import { Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ApiActionButton } from 'src/app/modules/shongo-table/buttons/api-action-button';
import { RowPredicate } from 'src/app/modules/shongo-table/buttons/table-button';
import { RuntimeParticipantTableData } from 'src/app/modules/shongo-table/data-sources/runtime-management.datasource';

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
      this.name = $localize`:button name:Unmute user`;
    } else {
      this.icon = 'mic_off';
      this.name = $localize`:button name:Mute user`;
    }
  }

  executeAction(row: RuntimeParticipantTableData): Observable<string> {
    this.addToLoading(row);

    const action = this.enableMicrophone ? 'unmute' : 'mute';

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
        mapTo(
          this.enableMicrophone
            ? $localize`:success message:User unmuted`
            : $localize`:success message:User muted`
        ),
        catchError(() => {
          this.removeFromLoading(row);

          if (this.enableMicrophone) {
            throw new Error($localize`:error message:Failed to unmute user`);
          } else {
            throw new Error($localize`:error message:Failed to mute user`);
          }
        })
      );
  }
}
