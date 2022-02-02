import { HttpParams } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { HasID } from 'src/app/models/interfaces/has-id.interface';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { DataTableDataSource } from './data-table-datasource';

/**
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

  getFakeApiResponse(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    _: HttpParams
  ): ApiResponse<K> {
    const startIndex = pageSize * pageIndex;

    const items = this._data
      .sort((a: K, b: K) => {
        const valueA = (a as Record<string, any>)[sortedColumn];
        const valueB = (b as Record<string, any>)[sortedColumn];

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
