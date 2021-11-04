import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/api-responses/api-response.interface';
import { ReservationRequest } from 'src/app/shared/models/api-responses/reservation-request.interface';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationRequestService {
  private _endpointURL: string;

  constructor(private _apiService: ApiService) {
    this._endpointURL = this._apiService.buildEndpointURL(
      Endpoint.RES_REQUEST,
      'v1'
    );
  }

  listResRequests(): Observable<ApiResponse<ReservationRequest>> {
    return this._apiService.listData(this._endpointURL);
  }
}
