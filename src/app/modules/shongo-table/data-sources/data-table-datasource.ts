import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import {
  catchError,
  first,
  map,
  switchMap,
  switchMapTo,
  tap,
} from 'rxjs/operators';
import {
  Observable,
  merge,
  Subject,
  of,
  BehaviorSubject,
  forkJoin,
} from 'rxjs';
import { PipeFunction, TableColumn } from '../models/table-column.interface';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { TableButton } from '../buttons/table-button';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/core/http/api.service';
import { DataTableFilter } from '../filter/data-table-filter';
import { Type } from '@angular/core';
import { MobileSort } from '../components/mobile-table/mobile-sort';

export const REFRESH_TIMEOUT = 200;

/**
 * Data source for the DataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export abstract class DataTableDataSource<T> extends DataSource<T> {
  readonly apiService?: ApiService;

  filterComponent?: Type<DataTableFilter>;
  displayedColumns: TableColumn<T>[] = [];
  buttons: TableButton<T>[] = [];
  paginator?: MatPaginator;
  sort?: MatSort;
  mobileSort?: MobileSort;
  filter$?: Observable<HttpParams>;

  data: ApiResponse<T> = { count: 0, items: [] };
  loading$: Observable<boolean>;

  private _loading$ = new Subject<boolean>();
  private _refresh$ = new Subject<void>();

  constructor() {
    super();
    this.loading$ = this._loading$.asObservable();
  }

  pipeData(data: unknown, pipeFunc?: PipeFunction): string {
    return pipeFunc ? pipeFunc(data) : String(data);
  }

  pipeRow(row: T): T {
    const pipedRow: T & any = Object.assign({}, row);

    Object.keys(row).forEach((key: string) => {
      const pipeFunc = this.displayedColumns.find(
        (column) => column.name === key
      )?.pipeFunc;
      pipedRow[key] = this.pipeData((row as any)[key], pipeFunc);
    });

    return pipedRow;
  }

  getColumnNames(): string[] {
    return this.displayedColumns.map((col) => col.name);
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<T[]> {
    const sortChangeObservable = this._createSortChangeObservable();
    const sort = (this.sort ?? this.mobileSort)!;

    if (this.paginator && (this.sort || this.mobileSort)) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      let updateStream$: Observable<unknown> = merge(
        sortChangeObservable,
        this.paginator.initialized,
        this.paginator.page,
        this._refresh$
      );

      if (this.filter$) {
        updateStream$ = merge(updateStream$, this.filter$);
      }

      return updateStream$.pipe(
        tap(() => {
          this._loading$.next(true);
        }),
        switchMapTo(this.filter$ ?? of(undefined)),
        switchMap((filter) =>
          this.getData(
            this.paginator!.pageSize,
            this.paginator!.pageIndex,
            sort.active,
            sort.direction,
            filter ?? new HttpParams()
          ).pipe(
            first(),
            catchError(() => of({ count: 0, items: [], error: true }))
          )
        ),
        map((res) => {
          const pipedItems = res.items.map((item) => this.pipeRow(item));
          return {
            count: res.count,
            items: pipedItems,
            error: res.error ?? false,
          };
        }),
        tap((res: ApiResponse<T>) => {
          this.data = res;
          this._loading$.next(false);
        }),
        map((res) => res.items)
      );
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.'
      );
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {
    this.sort = undefined;
    this.mobileSort = undefined;
    this.paginator = undefined;
    this.filter$ = undefined;
  }

  /**
   * Refreshes table data.
   */
  refreshData(): void {
    this._loading$.next(true);

    // Add a tiny timeout to simulate loading.
    setTimeout(() => this._refresh$.next(), REFRESH_TIMEOUT);
  }

  private _createSortChangeObservable(): Observable<Sort> {
    if (this.sort && this.mobileSort) {
      throw new Error('Table cannot use both sort and mobile sort.');
    } else if (this.sort) {
      return this.sort.sortChange;
    } else if (this.mobileSort) {
      return this.mobileSort.sortChange$;
    }
    throw new Error('Table must have either sort or mobile sort.');
  }

  abstract getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<T>>;
}
