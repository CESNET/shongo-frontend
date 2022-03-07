import { Observable } from 'rxjs';
import { HasID } from 'src/app/models/interfaces/has-id.interface';
import { ActionButton } from './action-button';
import { IsDisabledFunction } from './table-button';

export class CustomActionButton<T extends HasID> extends ActionButton<T> {
  constructor(
    public name: string,
    public icon: string,
    public customFunc: (row: T) => Observable<string>,
    public isDisabledFunc?: IsDisabledFunction<T>
  ) {
    super(isDisabledFunc);
  }

  executeAction(row: T): Observable<string> {
    return this.customFunc(row);
  }
}
