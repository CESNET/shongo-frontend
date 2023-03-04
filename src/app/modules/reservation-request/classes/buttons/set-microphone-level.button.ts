import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, mergeMap, tap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ApiActionButton } from 'src/app/modules/shongo-table/buttons/api-action-button';
import { RowPredicate } from 'src/app/modules/shongo-table/buttons/table-button';
import { RuntimeParticipantTableData } from 'src/app/modules/shongo-table/data-sources/runtime-management.datasource';
import { SetMictophoneLevelDialogComponent } from '../../components/set-mictophone-level-dialog/set-mictophone-level-dialog.component';

export class SetMicrophoneLevelButton extends ApiActionButton<RuntimeParticipantTableData> {
  icon = 'volume_down';
  name = $localize`:button name:Set microphone level`;

  constructor(
    public resReqService: ReservationRequestService,
    public dialog: MatDialog,
    public requestId: string,
    public isDisabledFunc?: RowPredicate<RuntimeParticipantTableData>,
    public displayButtonFunc?: RowPredicate<RuntimeParticipantTableData>
  ) {
    super(isDisabledFunc, displayButtonFunc);
  }

  executeAction(row: RuntimeParticipantTableData): Observable<string> {
    const dialogRef = this.dialog.open(SetMictophoneLevelDialogComponent, {
      data: { microphoneLevel: row.microphoneLevel },
    });

    return dialogRef.afterClosed().pipe(
      mergeMap((res): Observable<string> => {
        if (res) {
          this.addToLoading(row);
          return this.resReqService
            .setParticipantMicrophoneLevel(this.requestId, row.id, res)
            .pipe(
              tap(() => {
                this.removeFromLoading(row);
              }),
              mapTo($localize`:success message:Microphone level adjusted`),
              catchError(() => {
                this.removeFromLoading(row);
                throw new Error(
                  $localize`:error message:Failed to adjust microphone level`
                );
              })
            );
        } else {
          return of('');
        }
      })
    );
  }
}
