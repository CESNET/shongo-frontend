import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/api-responses/api-response.interface';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private _http: HttpClient) {}

  buildEndpointURL(endpoint: Endpoint, version: string) {
    return `http://${environment.shongoRESTApiHost}:${environment.shongoRESTApiPort}/api/${version}/${endpoint}`;
  }

  listData<T>(endpointURL: string): Observable<ApiResponse<T>> {
    return this._http.get<ApiResponse<T>>(endpointURL);
  }
}
