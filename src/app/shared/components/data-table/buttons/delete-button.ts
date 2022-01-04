import { MatDialog } from '@angular/material/dialog';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mapTo, mergeMap, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api.service';
import { HasID } from 'src/app/models/has-id.interface';
import { CertainityCheckComponent } from '../../certainity-check/certainity-check.component';
import { ApiActionButton } from './api-action-button';

export class DeleteButton<T extends HasID> extends ApiActionButton<T> {
  icon = 'delete';
  name = 'Delete';

  constructor(private _apiService: ApiService, private _dialog: MatDialog) {
    super();
  }

  executeAction(row: T): Observable<string> {
    const dialogRef = this._dialog.open(CertainityCheckComponent);

    return dialogRef.afterClosed().pipe(
      mergeMap((res): Observable<string> => {
        if (res) {
          this.addToLoading(row);
          return this._apiService.deleteItem(row.id).pipe(
            tap(() => {
              this.removeFromLoading(row);
              this._deleted$.next();
            }),
            mapTo('Item deleted successfully.'),
            catchError(() => {
              this.removeFromLoading(row);
              return throwError('Item deletion failed.');
            })
          );
        } else {
          return of('');
        }
      })
    );
  }
}
