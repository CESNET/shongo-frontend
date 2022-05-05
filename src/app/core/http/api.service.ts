import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { environment } from 'src/environments/environment';
import { SortDirection } from '@angular/material/sort';
import { catchError, first } from 'rxjs/operators';

/**
 * Abstract service for API interaction. Implements basic API interaction methods and URL building.
 */
export abstract class ApiService {
  /**
   * URL of endpoint handled by the service.
   */
  endpointURL: string;

  constructor(
    protected _http: HttpClient,
    endpoint: Endpoint,
    version: string
  ) {
    this.endpointURL = ApiService.buildEndpointURL(endpoint, version);
  }

  /**
   * Builds the endpoint URL.
   *
   * @param endpoint Endpoint path.
   * @param version Endpoint version.
   * @returns Endpoint URL.
   */
  static buildEndpointURL(endpoint: string, version: string) {
    return `http://${environment.shongoRESTApiHost}:${environment.shongoRESTApiPort}/api/${version}/${endpoint}`;
  }

  /**
   * Fetches a paginated list of items from the backend.
   *
   * @param httpParams Query parameters.
   * @param url Endpoint URL.
   * @returns API response of fetched items.
   */
  fetchItems<T>(
    httpParams?: HttpParams,
    url = this.endpointURL
  ): Observable<ApiResponse<T>> {
    return this._http.get<ApiResponse<T>>(url, { params: httpParams }).pipe(
      first(),
      catchError((err) => {
        console.error(err);
        return throwError(err);
      })
    );
  }

  /**
   * Fetches a list of items for a data table.
   *
   * @param pageSize Number of items on a page.
   * @param pageIndex Page index.
   * @param sortedColumn Name of column to sort by.
   * @param sortDirection Sort direction.
   * @param filter Http parameters to filter results by.
   * @param url Endpoint URL.
   * @returns API response of fetched items.
   */
  fetchTableItems<T>(
    pageSize?: number,
    pageIndex?: number,
    sortedColumn?: string,
    sortDirection?: SortDirection,
    filter?: HttpParams,
    url = this.endpointURL
  ): Observable<ApiResponse<T>> {
    let httpParams = filter ?? new HttpParams();

    if (pageSize != null) {
      httpParams = httpParams.set('count', pageSize);

      if (pageIndex != null) {
        httpParams = httpParams.set('start', pageSize * pageIndex);
      }
    }
    if (sortedColumn) {
      httpParams = httpParams.set('sort_by', sortedColumn);
    }
    if (sortDirection) {
      httpParams = httpParams.set('sort_dir', sortDirection);
    }

    return this.fetchItems<T>(httpParams, url);
  }

  /**
   * Deletes multiple items by ID.
   *
   * @param ids Array of item IDs.
   * @param url Endpoint URL.
   * @returns Observable of API response.
   */
  deleteItems(ids?: string[], url = this.endpointURL): Observable<{}> {
    return this._http.delete(url, { body: ids ?? undefined });
  }

  /**
   * Fetches an item by ID.
   *
   * @param id Item ID.
   * @param url Endpoint URL.
   * @returns Observable of fetched item.
   */
  fetchItem<T>(id: string, url = this.endpointURL): Observable<T> {
    return this._http.get<T>(`${url}/${id}`);
  }

  /**
   * Deletes an item by ID.
   *
   * @param id Item ID.
   * @param url Endpoint URL.
   * @returns Observable of API response.
   */
  deleteItem(id: string, url = this.endpointURL): Observable<{}> {
    return this.deleteByUrl(`${url}/${id}`);
  }

  /**
   * Deletes an item by URL.
   *
   * @param url URL of item to delete.
   * @returns Observable of API response.
   */
  deleteByUrl(url: string): Observable<{}> {
    return this._http.delete<{}>(url);
  }

  /**
   * Posts an item.
   *
   * @param body Item body.
   * @param url Endpoint URL.
   * @returns Observable of API response.
   */
  postItem<T>(body: T, url = this.endpointURL): Observable<unknown> {
    return this._http.post(url, body);
  }

  /**
   * Edits an item.
   *
   * @param id Item ID.
   * @param body Item body.
   * @param url Endpoint URL.
   * @returns Observable of API response.
   */
  putItem<T>(id: string, body: T, url = this.endpointURL): Observable<unknown> {
    return this._http.put(`${url}/${id}`, body);
  }
}
