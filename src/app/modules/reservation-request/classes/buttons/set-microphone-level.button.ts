import { MatDialog } from '@angular/material/dialog';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mapTo, mergeMap, tap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ApiActionButton } from 'src/app/shared/components/data-table/buttons/api-action-button';
import { RowPredicate } from 'src/app/shared/components/data-table/buttons/table-button';
import { RuntimeParticipantTableData } from 'src/app/shared/components/data-table/data-sources/runtime-management.datasource';
import { SetMictophoneLevelDialogComponent } from '../../components/set-mictophone-level-dialog/set-mictophone-level-dialog.component';

export class SetMicrophoneLevelButton extends ApiActionButton<RuntimeParticipantTableData> {
  icon = 'volume_down';
  name = 'Set microphone level';

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
              mapTo('Successfully adjusted microphone level.'),
              catchError(() => {
                this.removeFromLoading(row);
                return throwError('Failed to adjust microphone level.');
              })
            );
        } else {
          return of('');
        }
      })
    );
  }
}
