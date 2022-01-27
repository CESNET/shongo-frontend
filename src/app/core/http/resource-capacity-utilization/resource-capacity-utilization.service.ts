import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class ResourceCapacityUtilizationService extends ApiService {
  constructor(protected _http: HttpClient) {
    super(_http, Endpoint.RESOURCE_CAPACITY_UTILIZATION, 'v1');
  }
}
