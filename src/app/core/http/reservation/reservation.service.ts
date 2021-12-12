import { Injectable } from '@angular/core';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { ApiService } from '../api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Reservation } from 'src/app/shared/models/rest-api/reservation.interface';

@Injectable({
  providedIn: 'root',
})
export class ReservationService extends ApiService {
  constructor(protected _http: HttpClient) {
    super(_http, Endpoint.RESERVATION, 'v1');
  }

  fetchReservations(resource: string): Observable<ApiResponse<Reservation>> {
    const httpParams = new HttpParams().set('resource', resource);
    return this.fetchItems(httpParams);
  }
}
