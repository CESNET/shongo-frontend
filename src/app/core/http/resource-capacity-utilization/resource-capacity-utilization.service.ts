import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { ResourceUtilizationDetail } from 'src/app/shared/models/rest-api/resource-utilization-detail.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class ResourceCapacityUtilizationService extends ApiService {
  constructor(protected _http: HttpClient) {
    super(_http, Endpoint.RESOURCE_CAPACITY_UTILIZATION, 'v1');
  }

  fetchResourceUsage(
    resourceId: string,
    intervalFrom: string,
    intervalTo: string
  ): Observable<ResourceUtilizationDetail> {
    const detailUrl = this.endpointURL + '/detail';

    const httpParams = new HttpParams()
      .set('resourceId', resourceId)
      .set('intervalFrom', intervalFrom)
      .set('intervalTo', intervalTo);

    return this._http.get<ResourceUtilizationDetail>(detailUrl, {
      params: httpParams,
    });
  }
}
