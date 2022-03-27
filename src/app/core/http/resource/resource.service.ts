import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ResourceCapacityUtilization } from 'src/app/shared/models/rest-api/resource-capacity-utilization.interface';
import { ResourceUtilizationDetail } from 'src/app/shared/models/rest-api/resource-utilization-detail.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class ResourceService extends ApiService {
  constructor(protected _http: HttpClient) {
    super(_http, Endpoint.RESOURCE, 'v1');
  }

  fetchCapacityUtilization(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<ResourceCapacityUtilization>> {
    return this.fetchTableItems(
      pageSize,
      pageIndex,
      sortedColumn,
      sortDirection,
      filter,
      `${this.endpointURL}/capacity_utilizations`
    );
  }

  fetchResourceUtilization(
    resourceId: string,
    intervalFrom: string,
    intervalTo: string
  ): Observable<ResourceUtilizationDetail> {
    const detailUrl = `${this.endpointURL}/${resourceId}/capacity_utilizations`;

    const httpParams = new HttpParams()
      .set('resource', resourceId)
      .set('interval_from', intervalFrom)
      .set('interval_to', intervalTo);

    return this._http.get<ResourceUtilizationDetail>(detailUrl, {
      params: httpParams,
    });
  }
}
