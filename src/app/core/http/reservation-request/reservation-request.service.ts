import { Injectable } from '@angular/core';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { ApiService } from '../api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Role } from 'src/app/shared/models/rest-api/role.interface';

@Injectable({
  providedIn: 'root',
})
export class ReservationRequestService extends ApiService {
  constructor(protected _http: HttpClient) {
    super(_http, Endpoint.RES_REQUEST, 'v1');
  }

  fetchUserRoles(
    pageSize: number,
    pageIndex: number,
    requestId: string
  ): Observable<ApiResponse<Role>> {
    const httpParams = new HttpParams()
      .set('offset', pageSize * pageIndex)
      .set('limit', pageSize);
    const rolesEndpoint = `${this.endpointURL}/${requestId}/role`;
    return this.fetchItems(httpParams, rolesEndpoint);
  }
}
