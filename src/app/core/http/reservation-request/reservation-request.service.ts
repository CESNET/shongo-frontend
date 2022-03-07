import { Injectable } from '@angular/core';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { ApiService } from '../api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Role } from 'src/app/shared/models/rest-api/role.interface';
import {
  GuestParticipantPostBody,
  RequestParticipant,
  RoleBody,
  UserParticipantPostBody,
} from 'src/app/shared/models/rest-api/request-participant.interface';

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
    const rolesEndpoint = `${this.endpointURL}/${requestId}/roles`;
    return this.fetchItems(httpParams, rolesEndpoint);
  }

  fetchParticipants(
    pageSize: number,
    pageIndex: number,
    requestId: string
  ): Observable<ApiResponse<RequestParticipant>> {
    const httpParams = new HttpParams()
      .set('offset', pageSize * pageIndex)
      .set('limit', pageSize);
    const participantsEndpoint = `${this.endpointURL}/${requestId}/participants`;
    return this.fetchItems(httpParams, participantsEndpoint);
  }

  postUserParticipant(
    body: UserParticipantPostBody,
    requestId: string
  ): Observable<UserParticipantPostBody> {
    const url = `${this.endpointURL}/${requestId}/user_participants`;
    return this.postItem<UserParticipantPostBody>(
      body,
      url
    ) as Observable<UserParticipantPostBody>;
  }

  postGuestParticipant(
    body: GuestParticipantPostBody,
    requestId: string
  ): Observable<GuestParticipantPostBody> {
    const url = `${this.endpointURL}/${requestId}/guest_participants`;
    return this.postItem<GuestParticipantPostBody>(
      body,
      url
    ) as Observable<GuestParticipantPostBody>;
  }

  postRole(body: RoleBody, requestId: string): Observable<RoleBody> {
    const url = `${this.endpointURL}/${requestId}/roles`;
    return this.postItem<RoleBody>(body, url) as Observable<RoleBody>;
  }
}
