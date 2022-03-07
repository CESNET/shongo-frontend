import { MatDialog } from '@angular/material/dialog';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mapTo, mergeMap, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api.service';
import { CertainityCheckComponent } from '../../certainity-check/certainity-check.component';
import { WithPathTemplate } from '../models/interfaces/with-path-template.interface';
import { ApiActionButton } from './api-action-button';
import { IsDisabledFunction } from './table-button';

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
    public isDisabledFunc?: IsDisabledFunction<T>
  ) {
    super(isDisabledFunc);
  }

  executeAction(row: T): Observable<string> {
    const dialogRef = this.dialog.open(CertainityCheckComponent);

    const path = this.constructPath(row, this.pathTemplate);
    const url = `${this.apiService.endpointURL}${path}`;

    return dialogRef.afterClosed().pipe(
      mergeMap((res): Observable<string> => {
        if (res) {
          this.addToLoading(row);
          return this.apiService.deleteByUrl(url).pipe(
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
