import { Observable } from 'rxjs';
import { RowPredicate, TableButton } from './table-button';

export abstract class ActionButton<T> extends TableButton<T> {
  constructor(
    public isDisabledFunc?: RowPredicate<T>,
    public displayButtonFunc?: RowPredicate<T>
  ) {
    super(isDisabledFunc, displayButtonFunc);
  }

  abstract executeAction(row: T): Observable<string>;
}
