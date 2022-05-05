import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { ApiService } from '../api.service';

/**
 * Service for interaction with groups endpoint.
 */
@Injectable({
  providedIn: 'root',
})
export class GroupService extends ApiService {
  constructor(protected _http: HttpClient) {
    super(_http, Endpoint.GROUP, 'v1');
  }
}
