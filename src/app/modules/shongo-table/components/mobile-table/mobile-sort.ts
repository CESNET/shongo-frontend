import { Sort, SortDirection } from '@angular/material/sort';
import { Observable, Subject } from 'rxjs';

export class MobileSort {
  active: string = '';
  direction: SortDirection = '';

  readonly sortChange$: Observable<Sort>;

  private readonly _sortChange$ = new Subject<Sort>();

  constructor() {
    this.sortChange$ = this._sortChange$;
  }

  changeSort({ active, direction }: Sort): void {
    this.active = active;
    this.direction = direction;
    this._sortChange$.next({ active, direction });
  }
}
