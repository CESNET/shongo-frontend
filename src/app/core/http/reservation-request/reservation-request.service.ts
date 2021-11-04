import { Injectable } from '@angular/core';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReservationRequestService extends ApiService {
  constructor(protected _http: HttpClient) {
    super(_http, Endpoint.RES_REQUEST, 'v1');
  }
}
