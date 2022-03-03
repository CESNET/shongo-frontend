import { Observable } from 'rxjs';
import { TableButton } from './table-button';

export abstract class ActionButton<T> extends TableButton {
  constructor() {
    super();
  }

  abstract executeAction(row: T): Observable<string>;
}
