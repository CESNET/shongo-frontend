import { DataSource } from '@angular/cdk/collections';
import { HttpParams } from '@angular/common/http';
import { Type } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { BehaviorSubject, merge, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  finalize,
  first,
  map,
  skip,
  switchMap,
  tap,
} from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api.service';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { TableButton } from '../buttons/table-button';
import { MobileSort } from '../components/mobile-table/mobile-sort';
import { DataTableFilter } from '../filter/data-table-filter';
import { PipeFunction, TableColumn } from '../models/table-column.interface';

export const REFRESH_TIMEOUT = 200;

/**
 * Data source for the DataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export abstract class DataTableDataSource<T> extends DataSource<T> {
  readonly apiService?: ApiService;

  /**
   * Filter component which will get rendered inside the table.
   */
  filterComponent?: Type<DataTableFilter>;

  /**
   * Array of displayed columns for the table.
   */
  displayedColumns: TableColumn<T>[] = [];

  /**
   * Array of buttons displayed in each table row.
   */
  buttons: TableButton<T>[] = [];

  /**
   * Material paginator.
   */
  paginator?: MatPaginator;

  /**
   * Material sort.
   */
  sort?: MatSort;

  /**
   * Mobile sort (for mobile table).
   */
  mobileSort?: MobileSort;

  /**
   * Observable of http query parameters from filter component.
   */
  filter$?: Observable<HttpParams>;

  /**
   * Whether query parameter 'refresh' should be used to force data refresh on the backend
   * instead of using cached response.
   */
  useHttpRefreshParam = false;

  /**
   * Loaded data.
   */
  data: ApiResponse<T> = { count: 0, items: [] };

  /**
   * Observable of loading state.
   */
  loading$: Observable<boolean>;

  private _manualDataUpdate$ = new Subject<ApiResponse<T>>();
  private _loading$ = new BehaviorSubject(true);
  private _refresh$ = new Subject<{ refresh: boolean }>();

  constructor() {
    super();
    this.loading$ = this._loading$.asObservable();
  }

  /**
   * Transform column data with a specified pipe function.
   *
   * @param data Column data.
   * @param pipeFunc Pipe function.
   * @returns Transformed data.
   */
  pipeData(data: unknown, pipeFunc?: PipeFunction): string {
    return pipeFunc ? pipeFunc(data) : String(data);
  }

  /**
   * Transforms the entire row with pipe functions
   * specified for each column.
   *
   * @param row Table row.
   * @returns Transformed row.
   */
  pipeRow(row: T): T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipedRow: T & any = Object.assign({}, row);

    Object.keys(row as object).forEach((key: string) => {
      const pipeFunc = this.displayedColumns.find(
        (column) => column.name === key
      )?.pipeFunc;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pipedRow[key] = this.pipeData((row as any)[key], pipeFunc);
    });

    return pipedRow;
  }

  /**
   * Returns names of displayed table columns.
   *
   * @returns Array of column names.
   */
  getColumnNames(): string[] {
    return this.displayedColumns.map((col) => col.name);
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items or we manually update the data.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<T[]> {
    const sortChangeObservable = this._createSortChangeObservable();

    if (this.paginator && (this.sort || this.mobileSort)) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      let updateStream$: Observable<unknown> = merge(
        sortChangeObservable.pipe(skip(1)),
        this.paginator.initialized,
        this.paginator.page.pipe(skip(1)),
        this._refresh$
      );

      // Add filter to update stream if it exists.
      if (this.filter$) {
        updateStream$ = merge(updateStream$, this.filter$.pipe(skip(1)));
      }

      // Merge emissions from data fetch observable with emission from manual updates.
      // This way we can manually update data, e.g. after row deletion.
      return merge(
        this._createDataFetchObservable(updateStream$),
        this._manualDataUpdate$.asObservable()
      ).pipe(
        tap((res: ApiResponse<T>) => {
          this.data = res;
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
   * Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {
    this.sort = undefined;
    this.mobileSort = undefined;
    this.paginator = undefined;
    this.filter$ = undefined;
  }

  /**
   * Refreshes table data. Adds a tiny arbitrary refresh delay for better UX.
   */
  refreshData(): void {
    // Add a tiny timeout to simulate loading.
    setTimeout(
      () => this._refresh$.next({ refresh: this.useHttpRefreshParam }),
      REFRESH_TIMEOUT
    );
  }

  /**
   * Manually deletes item from the table data and emits edited data from the
   * data source output stream.
   *
   * @param item Item to be deleted.
   */
  deleteItem(item: T): void {
    const newItems = this.data.items.filter(
      (currentItem) => currentItem !== item
    );
    this._manualDataUpdate$.next({
      count: this.data.count - 1,
      items: newItems,
      error: false,
    });
  }

  /**
   * Creates observable of sort changes, expects that
   * only default sort or mobile sort property is defined.
   *
   * @returns Observable of table sort.
   */
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

  /**
   * Creates data source's output stream observable,
   * which re-fetches data after every update stream emission.
   *
   * @param updateStream$ Stream of every events which should trigger data fetch.
   * @returns Data source output stream.
   */
  private _createDataFetchObservable(
    updateStream$: Observable<unknown>
  ): Observable<ApiResponse<T>> {
    const sort = (this.sort ?? this.mobileSort)!;

    return updateStream$.pipe(
      tap(() => {
        // Start loading
        this._loading$.next(true);
      }),
      switchMap((update) => this._getFilter(update)),
      switchMap((filter) =>
        this.getData(
          this.paginator!.pageSize,
          this.paginator!.pageIndex,
          this._getSortBy(sort.active),
          sort.direction,
          filter
        ).pipe(
          first(),
          catchError(() => of({ count: 0, items: [], error: true })),
          finalize(() => this._loading$.next(false))
        )
      ),
      map((res) => {
        // Transform data to readable form with pipe functions.
        const pipedItems = res.items.map((item) => this.pipeRow(item));
        return {
          count: res.count,
          items: pipedItems,
          error: res.error ?? false,
        };
      })
    );
  }

  /**
   * Gets observable of HTTP query parameters for querying API responses.
   *
   * Checks if data emitted from update stream contain refresh property
   * and if so, tries to add refresh query parameter. This parameter
   * forces backend not to use cache.
   *
   * @param update Data emitted from update stream.
   * @returns Observable of HTTP query parameters.
   */
  private _getFilter(update: unknown): Observable<HttpParams> {
    if (!this.filter$) {
      return of(this._setRefreshIfActive(new HttpParams(), update));
    }
    return this.filter$.pipe(
      first(),
      map((httpParams) => this._setRefreshIfActive(httpParams, update))
    );
  }

  /**
   * Sets refresh query parameter to HTTP parameters if
   * update emission object contains refresh property and
   * usage of refresh parameter is permitted by data source.
   *
   * @param httpParams HTTP query parameters.
   * @param update Update emission object.
   * @returns HTTP parameters.
   */
  private _setRefreshIfActive(
    httpParams: HttpParams,
    update: unknown
  ): HttpParams {
    if (
      update !== undefined &&
      (update as { refresh: boolean }).refresh === true
    ) {
      return httpParams.set('refresh', true);
    }
    return httpParams;
  }

  /**
   * Maps column name to API sort key.
   *
   * @param columnName Column name.
   * @returns Sort by value.
   */
  private _getSortBy(columnName: string): string {
    return (
      this.displayedColumns.find((column) => column.name === columnName)
        ?.sortBy ?? ''
    );
  }

  /**
   * Gets table data, either from backend or by other means.
   *
   * @param pageSize Size of single page of response.
   * @param pageIndex Index of page.
   * @param sortedColumn Name of column to sort by.
   * @param sortDirection Sort direction.
   * @param filter HTTP query parameters.
   */
  abstract getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<T>>;
}
