import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api.service';
import { CertainityCheckComponent } from 'src/app/shared/components/certainity-check/certainity-check.component';
import { WithPathTemplate } from '../models/interfaces/with-path-template.interface';
import { ApiActionButton } from './api-action-button';
import { RowPredicate } from './table-button';

/**
 * Button for performing delete API call on row item.
 */
export class DeleteButton<T>
  extends ApiActionButton<T>
  implements WithPathTemplate
{
  icon = 'delete';
  name = 'Delete';

  constructor(
    public apiService: ApiService,
    public dialog: MatDialog,
    public pathTemplate: string,
    public isDisabledFunc?: RowPredicate<T>,
    public displayButtonFunc?: RowPredicate<T>,
    public customErrorHandler?: (row: T, err: Error) => Observable<string>
  ) {
    super(isDisabledFunc, displayButtonFunc);
  }

  /**
   * Creates a delete HTTP request for a given table row.
   *
   * @param row Table row.
   * @returns Observable of alert message.
   */
  executeAction(row: T): Observable<string> {
    // Checks user intention.
    const dialogRef = this.dialog.open(CertainityCheckComponent, {
      data: {
        message: $localize`Are you sure you want to delete this item?`,
      },
    });

    // Constructs path to delete endpoint.
    const path = this.constructPath(row, this.pathTemplate);

    // Constructs whole endpoint URL.
    const url = `${this.apiService.endpointURL}${path}`;

    return dialogRef.afterClosed().pipe(
      mergeMap((res): Observable<string> => {
        if (res) {
          // Start loading on deleted row.
          this.addToLoading(row);

          return this.apiService.deleteByUrl(url).pipe(
            tap(() => {
              // Finish loading and emit delete event.
              this.removeFromLoading(row);
              this._deleted$.next(row);
            }),
            map(() => $localize`:success message:Item deleted`),
            catchError((err) => {
              // Finish loading.
              this.removeFromLoading(row);

              // Try using custom error handler, if it doesn't exist or doesn't throw an error, throw generic error.
              if (this.customErrorHandler) {
                return this.customErrorHandler(row, err);
              } else {
                throw new Error($localize`:error message:Item deletion failed`);
              }
            })
          );
        } else {
          return of('');
        }
      })
    );
  }
}
