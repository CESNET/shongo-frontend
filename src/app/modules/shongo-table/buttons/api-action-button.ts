import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ActionButton } from './action-button';
import { RowPredicate } from './table-button';

/**
 * Button for executing asynchronous API calls.
 */
export abstract class ApiActionButton<T> extends ActionButton<T> {
  readonly loading$: Observable<T[]>;
  readonly rowUpdate$: Observable<T>;
  readonly deleted$: Observable<T>;

  protected readonly _loading$ = new BehaviorSubject<T[]>([]);
  protected readonly _rowUpdate$ = new Subject<T>();
  protected readonly _deleted$ = new Subject<T>();

  constructor(
    public isDisabledFunc?: RowPredicate<T>,
    public displayButtonFunc?: RowPredicate<T>
  ) {
    super(isDisabledFunc, displayButtonFunc);

    this.loading$ = this._loading$.asObservable();
    this.rowUpdate$ = this._rowUpdate$.asObservable();
    this.deleted$ = this._deleted$.asObservable();
  }

  /**
   * Adds row to loading observable.
   *
   * @param row Table row.
   */
  addToLoading(row: T): void {
    this._loading$.next(this._loading$.value.concat([row]));
  }

  /**
   * Adds row from loading observable.
   *
   * @param row Table row.
   */
  removeFromLoading(row: T): void {
    this._loading$.next(this._removeItem(this._loading$.value, row));
  }

  /**
   * Removes item from array.
   *
   * @param array Array of items.
   * @param item Item to remove.
   */
  private _removeItem(array: T[], item: T): T[] {
    return array.filter((arrayItem) => arrayItem !== item);
  }
}
