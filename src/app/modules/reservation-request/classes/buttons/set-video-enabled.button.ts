import { Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ApiActionButton } from 'src/app/modules/shongo-table/buttons/api-action-button';
import { RowPredicate } from 'src/app/modules/shongo-table/buttons/table-button';
import { RuntimeParticipantTableData } from 'src/app/modules/shongo-table/data-sources/runtime-management.datasource';

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
      this.name = $localize`:button name:Enable camera`;
    } else {
      this.icon = 'videocam_off';
      this.name = $localize`:button name:Disable camera`;
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
          this.enableCamera
            ? $localize`:success message:Camera enabled`
            : $localize`:success message:Camera disabled`
        ),
        catchError(() => {
          this.removeFromLoading(row);

          if (this.enableCamera) {
            throw new Error($localize`:error message:Failed to enable camera`);
          } else {
            throw new Error($localize`:error message:Failed to disable camera`);
          }
        })
      );
  }
}
