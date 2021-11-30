import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { environment } from 'src/environments/environment';
import { SortDirection } from '@angular/material/sort';

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

  fetchItems<T>(): Observable<ApiResponse<T>> {
    return this._http.get<ApiResponse<T>>(this.endpointURL);
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

    return this._http.get<ApiResponse<T>>(this.endpointURL, {
      params: httpParams,
    });
  }

  deleteItem(id: string): Observable<{}> {
    return this._http.delete<{}>(this.endpointURL, { body: { id } });
  }
}
