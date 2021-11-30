import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { map, switchMap, switchMapTo, tap } from 'rxjs/operators';
import { Observable, merge, Subject, of } from 'rxjs';
import { HasID } from 'src/app/shared/components/data-table/models/has-id.interface';
import { PipeFunction, TableColumn } from '../models/table-column.interface';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { TableButton } from '../models/table-button.interface';
import { HttpParams } from '@angular/common/http';

export const REFRESH_TIMEOUT = 200;

/**
 * Data source for the DataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export abstract class DataTableDataSource<
  T extends HasID
> extends DataSource<T> {
  abstract displayedColumns: TableColumn[];
  abstract buttons: TableButton<T>[];
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
        tap(() => this._loading$.next(true)),
        switchMapTo(this.filter$ ?? of(undefined)),
        switchMap((filter) =>
          this.getData(
            this.paginator!.pageSize,
            this.paginator!.pageIndex,
            this.sort!.active,
            this.sort!.direction,
            filter ?? new HttpParams()
          )
        ),
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
