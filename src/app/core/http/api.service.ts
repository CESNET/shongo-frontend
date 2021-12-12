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
    this.endpointURL = this._buildEndpointURL(endpoint, version);
  }

  private _buildEndpointURL(endpoint: Endpoint, version: string) {
    return `http://${environment.shongoRESTApiHost}:${environment.shongoRESTApiPort}/api/${version}/${endpoint}`;
  }

  fetchItems<T>(httpParams?: HttpParams): Observable<ApiResponse<T>> {
    return this._http
      .get<ApiResponse<T>>(this.endpointURL, { params: httpParams })
      .pipe(
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
    filter: HttpParams
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

    return this.fetchItems<T>(httpParams);
  }

  deleteItem(id: string): Observable<{}> {
    return this._http.delete<{}>(this.endpointURL, { body: { id } });
  }
}
