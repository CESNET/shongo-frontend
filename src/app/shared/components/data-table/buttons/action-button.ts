import { Observable } from 'rxjs';
import { IsDisabledFunction, TableButton } from './table-button';

export abstract class ActionButton<T> extends TableButton<T> {
  constructor(public isDisabledFunc?: IsDisabledFunction<T>) {
    super(isDisabledFunc);
  }

  abstract executeAction(row: T): Observable<string>;
}
