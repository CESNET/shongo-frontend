import { Observable } from 'rxjs';
import { RowPredicate, TableButton } from './table-button';

/**
 * Button for executing some action.
 */
export abstract class ActionButton<T> extends TableButton<T> {
  constructor(
    public isDisabledFunc?: RowPredicate<T>,
    public displayButtonFunc?: RowPredicate<T>
  ) {
    super(isDisabledFunc, displayButtonFunc);
  }

  /**
   * Action function.
   *
   * @param row Table row data.
   */
  abstract executeAction(row: T): Observable<string>;
}
