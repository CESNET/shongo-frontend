import { Observable } from 'rxjs';
import { HasID } from 'src/app/shared/models/interfaces/has-id.interface';
import { ActionButton } from './action-button';
import { RowPredicate } from './table-button';

/**
 * Button for executing custom action from constructor.
 */
export class CustomActionButton<T extends HasID> extends ActionButton<T> {
  constructor(
    public name: string,
    public icon: string,
    public customFunc: (row: T) => Observable<string>,
    public isDisabledFunc?: RowPredicate<T>,
    public displayButtonFunc?: RowPredicate<T>
  ) {
    super(isDisabledFunc, displayButtonFunc);
  }

  /**
   * Executes custom action function from constructor.
   *
   * @param row Table row.
   * @returns Observable of return message.
   */
  executeAction(row: T): Observable<string> {
    return this.customFunc(row);
  }
}
