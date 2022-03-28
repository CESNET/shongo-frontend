import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { catchError, map, switchMap, switchMapTo, tap } from 'rxjs/operators';
import { Observable, merge, Subject, of } from 'rxjs';
import { PipeFunction, TableColumn } from '../models/table-column.interface';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { TableButton } from '../buttons/table-button';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/core/http/api.service';

export const REFRESH_TIMEOUT = 200;

/**
 * Data source for the DataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export abstract class DataTableDataSource<T> extends DataSource<T> {
  readonly apiService?: ApiService;

  displayedColumns: TableColumn<T>[] = [];
  buttons: TableButton<T>[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filter$: Observable<HttpParams> | undefined;

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
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      let updateStream$: Observable<unknown> = merge(
        this.paginator.initialized,
        this.paginator.page,
        this.sort.sortChange,
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
            this.sort!.active,
            this.sort!.direction,
            filter ?? new HttpParams()
          ).pipe(catchError(() => of({ count: 0, items: [], error: true })))
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
  disconnect(): void {}

  /**
   * Refreshes table data.
   */
  refreshData(): void {
    this._loading$.next(true);

    // Add a tiny timeout to simulate loading.
    setTimeout(() => this._refresh$.next(), REFRESH_TIMEOUT);
  }

  abstract getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<T>>;
}
