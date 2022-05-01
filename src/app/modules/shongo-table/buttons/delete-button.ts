import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api.service';
import { CertainityCheckComponent } from 'src/app/shared/components/certainity-check/certainity-check.component';
import { WithPathTemplate } from '../models/interfaces/with-path-template.interface';
import { ApiActionButton } from './api-action-button';
import { RowPredicate } from './table-button';

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
    public displayButtonFunc?: RowPredicate<T>
  ) {
    super(isDisabledFunc, displayButtonFunc);
  }

  executeAction(row: T): Observable<string> {
    const dialogRef = this.dialog.open(CertainityCheckComponent, {
      data: {
        message: $localize`Are you sure you want to delete this item?`,
      },
    });

    const path = this.constructPath(row, this.pathTemplate);
    const url = `${this.apiService.endpointURL}${path}`;

    return dialogRef.afterClosed().pipe(
      mergeMap((res): Observable<string> => {
        if (res) {
          this.addToLoading(row);
          return this.apiService.deleteByUrl(url).pipe(
            tap(() => {
              this.removeFromLoading(row);
              this._deleted$.next(row);
            }),
            map(() => $localize`:success message:Item deleted`),
            catchError(() => {
              this.removeFromLoading(row);
              throw new Error($localize`:error message:Item deletion failed`);
            })
          );
        } else {
          return of('');
        }
      })
    );
  }
}
