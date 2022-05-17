import { SortDirection } from '@angular/material/sort';
import { HasID } from 'src/app/shared/models/interfaces/has-id.interface';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { DataTableDataSource } from './data-table-datasource';

/**
 * Data source which doesn't asynchronously load table data, but gets all data inside the constructor.
 *
 * T - Type of table data returned from getData().
 * K - Type of data provided in constructor and returned in getFakeApiResponse().
 */
export abstract class StaticDataSource<
  T extends HasID,
  K extends HasID
> extends DataTableDataSource<T> {
  constructor(private _data: K[]) {
    super();
  }

  /**
   * Provides sorting and paginating functionality for static datasource. Returns data as a normal api response.
   *
   * @param pageSize Size of single page of response.
   * @param pageIndex Index of page.
   * @param sortedColumn Name of column to sort by.
   * @param sortDirection Sort direction.
   * @returns Fake api response with table data.
   */
  getFakeApiResponse(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection
  ): ApiResponse<K> {
    const startIndex = pageSize * pageIndex;

    const items = this._data
      .sort((a: K, b: K) => {
        const valueA = (a as Record<string, never>)[sortedColumn];
        const valueB = (b as Record<string, never>)[sortedColumn];

        if (!valueA || !valueB) {
          return 0;
        } else if (valueA > valueB) {
          return sortDirection === 'asc'
            ? 1
            : sortDirection === 'desc'
            ? -1
            : 0;
        } else if (valueA < valueB) {
          return sortDirection === 'asc'
            ? -1
            : sortDirection === 'desc'
            ? 1
            : 0;
        } else {
          return 0;
        }
      })
      .slice(startIndex, startIndex + pageSize);

    return {
      count: items.length,
      items,
    };
  }
}
