import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { map, switchMapTo, tap } from 'rxjs/operators';
import { Observable, merge } from 'rxjs';
import { HasID } from 'src/app/shared/components/data-table/models/has-id.interface';
import { PipeFunction, TableColumn } from '../models/table-column.interface';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { TableButton } from '../models/table-button.interface';

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
  data: ApiResponse<T> = { count: 0, items: [] };

  constructor() {
    super();
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
      return merge(
        this.paginator.initialized,
        this.paginator.page,
        this.sort.sortChange
      ).pipe(
        switchMapTo(
          this.getData(
            this.paginator!.pageIndex,
            this.paginator!.pageSize,
            this.sort!.active,
            this.sort!.direction
          )
        ),
        tap((res: ApiResponse<T>) => (this.data = res)),
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

  abstract getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection
  ): Observable<ApiResponse<T>>;
}
