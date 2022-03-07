import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { environment } from 'src/environments/environment';
import { SortDirection } from '@angular/material/sort';
import { catchError, first } from 'rxjs/operators';

export abstract class ApiService {
  endpointURL: string;

  constructor(
    protected _http: HttpClient,
    endpoint: Endpoint,
    version: string
  ) {
    this.endpointURL = this.buildEndpointURL(endpoint, version);
  }

  buildEndpointURL(endpoint: string, version: string) {
    return `http://${environment.shongoRESTApiHost}:${environment.shongoRESTApiPort}/api/${version}/${endpoint}`;
  }

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

  fetchTableItems<T>(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams,
    url = this.endpointURL
  ): Observable<ApiResponse<T>> {
    let httpParams = filter ?? new HttpParams();

    if (pageSize != null) {
      httpParams = httpParams.set('limit', pageSize);

      if (pageIndex != null) {
        httpParams = httpParams.set('offset', pageSize * pageIndex);
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

  fetchItem<T>(id: string, url = this.endpointURL): Observable<T> {
    return this._http.get<T>(`${url}/${id}`);
  }

  deleteItem(id: string, url = this.endpointURL): Observable<{}> {
    return this.deleteByUrl(`${url}/${id}`);
  }

  deleteByUrl(url: string): Observable<{}> {
    return this._http.delete<{}>(url);
  }

  postItem<T>(body: T, url = this.endpointURL): Observable<unknown> {
    return this._http.post(url, body);
  }
}
