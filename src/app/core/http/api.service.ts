import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { environment } from 'src/environments/environment';

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

  deleteItem(id: string): Observable<{}> {
    return this._http.delete<{}>(this.endpointURL, { body: { id } });
  }
}
