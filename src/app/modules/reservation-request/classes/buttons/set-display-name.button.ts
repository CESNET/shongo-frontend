import { MatDialog } from '@angular/material/dialog';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mapTo, mergeMap, tap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ApiActionButton } from 'src/app/modules/shongo-table/buttons/api-action-button';
import { RowPredicate } from 'src/app/modules/shongo-table/buttons/table-button';
import { RuntimeParticipantTableData } from 'src/app/modules/shongo-table/data-sources/runtime-management.datasource';
import { SetDisplayNameDialogComponent } from '../../components/set-display-name-dialog/set-display-name-dialog.component';

export class SetDisplayNameButton extends ApiActionButton<RuntimeParticipantTableData> {
  icon = 'badge';
  name = $localize`:button name:Set display name`;

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
    const dialogRef = this.dialog.open(SetDisplayNameDialogComponent, {
      data: { displayName: row.displayName },
    });

    return dialogRef.afterClosed().pipe(
      mergeMap((res): Observable<string> => {
        if (res) {
          this.addToLoading(row);
          return this.resReqService
            .setParticipantDisplayName(this.requestId, row.id, res)
            .pipe(
              tap(() => {
                this.removeFromLoading(row);
              }),
              mapTo($localize`:success message:Display name updated`),
              catchError(() => {
                this.removeFromLoading(row);
                return throwError(
                  $localize`:error message:Failed to update display name`
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
