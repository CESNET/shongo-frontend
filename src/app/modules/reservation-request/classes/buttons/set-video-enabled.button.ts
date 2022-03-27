import { Observable, throwError } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ApiActionButton } from 'src/app/shared/components/data-table/buttons/api-action-button';
import { RowPredicate } from 'src/app/shared/components/data-table/buttons/table-button';
import { RuntimeParticipantTableData } from 'src/app/shared/components/data-table/data-sources/runtime-management.datasource';

export class SetVideoEnabledButton extends ApiActionButton<RuntimeParticipantTableData> {
  icon: string;
  name: string;

  constructor(
    public resReqService: ReservationRequestService,
    public requestId: string,
    public enableCamera: boolean,
    public isDisabledFunc?: RowPredicate<RuntimeParticipantTableData>,
    public displayButtonFunc?: RowPredicate<RuntimeParticipantTableData>
  ) {
    super(isDisabledFunc, displayButtonFunc);

    if (enableCamera) {
      this.icon = 'videocam';
      this.name = 'Enable camera';
    } else {
      this.icon = 'videocam_off';
      this.name = 'Disable camera';
    }
  }

  executeAction(row: RuntimeParticipantTableData): Observable<string> {
    this.addToLoading(row);

    return this.resReqService
      .setParticipantVideoEnabled(this.requestId, row.id, this.enableCamera)
      .pipe(
        tap(() => {
          this.removeFromLoading(row);
        }),
        mapTo(
          `Camera ${this.enableCamera ? 'enabled' : 'disabled'} successfully.`
        ),
        catchError(() => {
          this.removeFromLoading(row);
          return throwError(
            `Failed to ${this.enableCamera ? 'enable' : 'disable'} camera.`
          );
        })
      );
  }
}
