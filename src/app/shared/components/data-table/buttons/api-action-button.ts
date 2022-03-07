import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ActionButton } from './action-button';
import { IsDisabledFunction } from './table-button';

export abstract class ApiActionButton<T> extends ActionButton<T> {
  loading$: Observable<T[]>;
  rowUpdate$: Observable<T>;
  deleted$: Observable<void>;

  protected _loading$ = new BehaviorSubject<T[]>([]);
  protected _rowUpdate$ = new Subject<T>();
  protected _deleted$ = new Subject<void>();

  constructor(public isDisabledFunc?: IsDisabledFunction<T>) {
    super(isDisabledFunc);

    this.loading$ = this._loading$.asObservable();
    this.rowUpdate$ = this._rowUpdate$.asObservable();
    this.deleted$ = this._deleted$.asObservable();
  }

  addToLoading(row: T): void {
    this._loading$.next(this._loading$.value.concat([row]));
  }

  removeFromLoading(row: T): void {
    this._loading$.next(this._removeItem(this._loading$.value, row));
  }

  private _removeItem(array: T[], item: T): T[] {
    return array.filter((arrayItem) => arrayItem !== item);
  }
}
