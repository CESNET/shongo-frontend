import { Injectable } from '@angular/core';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { ApiService } from '../api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Role } from 'src/app/shared/models/rest-api/role.interface';
import {
  RequestParticipant,
  RoleBody,
} from 'src/app/shared/models/rest-api/request-participant.interface';
import { RuntimeParticipant } from 'src/app/shared/models/rest-api/runtime-participant.interface';
import { SortDirection } from '@angular/material/sort';
import { Recording } from 'src/app/shared/models/rest-api/recording';
import { ParticipantPostBody } from 'src/app/shared/models/types/participant-post-body.type';

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
      .set('start', pageSize * pageIndex)
      .set('count', pageSize);
    const rolesEndpoint = `${this.endpointURL}/${requestId}/roles`;
    return this.fetchItems(httpParams, rolesEndpoint);
  }

  fetchParticipants(
    pageSize: number,
    pageIndex: number,
    requestId: string
  ): Observable<ApiResponse<RequestParticipant>> {
    const httpParams = new HttpParams()
      .set('start', pageSize * pageIndex)
      .set('count', pageSize);
    const participantsEndpoint = `${this.endpointURL}/${requestId}/participants`;
    return this.fetchItems(httpParams, participantsEndpoint);
  }

  postParticipant(
    body: ParticipantPostBody,
    requestId: string
  ): Observable<ParticipantPostBody> {
    const url = `${this.endpointURL}/${requestId}/participants`;
    return this.postItem<ParticipantPostBody>(
      body,
      url
    ) as Observable<ParticipantPostBody>;
  }

  postRole(body: RoleBody, requestId: string): Observable<RoleBody> {
    const url = `${this.endpointURL}/${requestId}/roles`;
    return this.postItem<RoleBody>(body, url) as Observable<RoleBody>;
  }

  fetchRuntimeParticipants(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams,
    requestId: string
  ): Observable<ApiResponse<RuntimeParticipant>> {
    const url = `${this.endpointURL}/${requestId}/runtime_management/participants`;
    return this.fetchTableItems<RuntimeParticipant>(
      pageSize,
      pageIndex,
      sortedColumn,
      sortDirection,
      filter,
      url
    );
  }

  setParticipantDisplayName(
    requestId: string,
    participantId: string,
    displayName: string
  ): Observable<string> {
    const url = `${this.endpointURL}/${requestId}/runtime_management/participants/${participantId}`;
    return this._http.patch<string>(url, { displayName });
  }

  setParticipantMicrophoneEnabled(
    requestId: string,
    participantId: string,
    microphoneEnabled: boolean
  ): Observable<string> {
    const url = `${this.endpointURL}/${requestId}/runtime_management/participants/${participantId}`;
    return this._http.patch<string>(url, { microphoneEnabled });
  }

  setParticipantVideoEnabled(
    requestId: string,
    participantId: string,
    videoEnabled: boolean
  ): Observable<string> {
    const url = `${this.endpointURL}/${requestId}/runtime_management/participants/${participantId}`;
    return this._http.patch<string>(url, { videoEnabled });
  }

  setParticipantMicrophoneLevel(
    requestId: string,
    participantId: string,
    microphoneLevel: number
  ): Observable<string> {
    if (microphoneLevel < 0 || microphoneLevel > 100) {
      throw new Error('Microphone level must be a number between 0 and 100');
    }

    const url = `${this.endpointURL}/${requestId}/runtime_management/participants/${participantId}`;
    return this._http.patch<string>(url, { microphoneLevel });
  }

  disconnectUser(requestId: string, participantId: string): Observable<string> {
    const url = `${this.endpointURL}/${requestId}/runtime_management/participants/${participantId}/disconnect`;
    return this._http.post<string>(url, {});
  }

  fetchRecordings(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams,
    requestId: string
  ): Observable<ApiResponse<Recording>> {
    const url = `${this.endpointURL}/${requestId}/recordings`;
    return this.fetchTableItems<Recording>(
      pageSize,
      pageIndex,
      sortedColumn,
      sortDirection,
      filter,
      url
    );
  }

  setRecording(requestId: string, record: boolean): Observable<void> {
    const url = `${
      this.endpointURL
    }/${requestId}/runtime_management/recording/${record ? 'start' : 'stop'}`;
    return this._http.post<void>(url, {});
  }

  acceptRequest(requestId: string): Observable<{}> {
    return this._http.post<{}>(`${this.endpointURL}/${requestId}/accept`, {});
  }

  rejectRequest(requestId: string): Observable<{}> {
    return this._http.post<{}>(`${this.endpointURL}/${requestId}/reject`, {});
  }
}
