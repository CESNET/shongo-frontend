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
import { EditReservationRequestBody } from 'src/app/shared/models/types/edit-reservation-request-body.type';

/**
 * Service for interaction with reservation request endpoint.
 */
@Injectable({
  providedIn: 'root',
})
export class ReservationRequestService extends ApiService {
  constructor(protected _http: HttpClient) {
    super(_http, Endpoint.RES_REQUEST, 'v1');
  }

  /**
   * Edits reservation request.
   *
   * @param id ID of request to be edited.
   * @param body Edit parameters.
   * @returns Observable of API response.
   */
  edit(
    id: string,
    body: EditReservationRequestBody
  ): Observable<Record<string, never>> {
    return this._http.patch<Record<string, never>>(
      `${this.endpointURL}/${id}`,
      body
    );
  }

  /**
   * Fetches user roles for a given reservation request.
   *
   * @param pageSize Number of items on a page.
   * @param pageIndex Page index.
   * @param requestId Reservation request ID.
   * @returns Observable of API response.
   */
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

  /**
   * Fetches participants for a giver reservation request.
   *
   * @param pageSize Number of items on a page.
   * @param pageIndex Page index.
   * @param requestId Reservation request ID.
   * @returns Observable of API response.
   */
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

  /**
   * Posts a participant for a given reservation request.
   *
   * @param body Participant body.
   * @param requestId Reservation request ID.
   * @returns Observable with created participant body.
   */
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

  /**
   * Posts a role for a given reservation request.
   *
   * @param body Role body.
   * @param requestId Reservation request ID.
   * @returns Observable with created role body.
   */
  postRole(body: RoleBody, requestId: string): Observable<RoleBody> {
    const url = `${this.endpointURL}/${requestId}/roles`;
    return this.postItem<RoleBody>(body, url) as Observable<RoleBody>;
  }

  /**
   * Fetches participants inside an ongoing meeting in an open virtual room.
   *
   * @param pageSize Number of items on a page.
   * @param pageIndex Page index.
   * @param sortedColumn Name of column to sort by.
   * @param sortDirection Sort direction.
   * @param filter Http parameters to filter results by.
   * @param requestId Reservation request ID.
   * @returns Observable of runtime participants.
   */
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

  /**
   * Sets a new display name for a runtime participant.
   *
   * @param requestId Reservation request ID.
   * @param participantId Runtime participant ID.
   * @param displayName New display name.
   * @returns Observable of API response.
   */
  setParticipantDisplayName(
    requestId: string,
    participantId: string,
    displayName: string
  ): Observable<string> {
    const url = `${this.endpointURL}/${requestId}/runtime_management/participants/${participantId}`;
    return this._http.patch<string>(url, { displayName });
  }

  /**
   * Enables/disables microphone for a runtime participant.
   *
   * @param requestId Reservation request ID.
   * @param participantId Runtime participant ID.
   * @param microphoneEnabled True to enable microphone, false to disable.
   * @returns Observable of API response.
   */
  setParticipantMicrophoneEnabled(
    requestId: string,
    participantId: string,
    microphoneEnabled: boolean
  ): Observable<string> {
    const url = `${this.endpointURL}/${requestId}/runtime_management/participants/${participantId}`;
    return this._http.patch<string>(url, { microphoneEnabled });
  }

  /**
   * Enables/disables video for a runtime participant.
   *
   * @param requestId Reservation request ID.
   * @param participantId Runtime participant ID.
   * @param videoEnabled True to enable video, false to disable.
   * @returns Observable of API response.
   */
  setParticipantVideoEnabled(
    requestId: string,
    participantId: string,
    videoEnabled: boolean
  ): Observable<string> {
    const url = `${this.endpointURL}/${requestId}/runtime_management/participants/${participantId}`;
    return this._http.patch<string>(url, { videoEnabled });
  }

  /**
   * Sets microphone sound level for a runtime participant.
   *
   * @param requestId Reservation request ID.
   * @param participantId Runtime participant ID.
   * @param microphoneLevel Microphone level between 0 and 100.
   * @returns Observable of API response.
   */
  setParticipantMicrophoneLevel(
    requestId: string,
    participantId: string,
    microphoneLevel: number
  ): Observable<string> {
    if (microphoneLevel < 0 || microphoneLevel > 100) {
      throw new Error(
        $localize`:error message:Microphone level must be a number between 0 and 100`
      );
    }

    const url = `${this.endpointURL}/${requestId}/runtime_management/participants/${participantId}`;
    return this._http.patch<string>(url, { microphoneLevel });
  }

  /**
   * Disconnects runtime participant from a meeting.
   *
   * @param requestId Reservation request ID.
   * @param participantId Runtime participant ID.
   * @returns Observable of API response.
   */
  disconnectUser(requestId: string, participantId: string): Observable<string> {
    const url = `${this.endpointURL}/${requestId}/runtime_management/participants/${participantId}/disconnect`;
    return this._http.post<string>(url, {});
  }

  /**
   * Fetches video recordings for a given reservation request.
   *
   * @param pageSize Number of items on a page.
   * @param pageIndex Page index.
   * @param sortedColumn Name of column to sort by.
   * @param sortDirection Sort direction.
   * @param filter Http parameters to filter results by.
   * @param requestId Reservation request ID.
   * @returns Observable of recordings.
   */
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

  /**
   * Enables/disables recording of a meeting for given reservation request.
   *
   * @param requestId Reservation request ID.
   * @param record True to start recording, false to stop.
   * @returns Observable of API response.
   */
  setRecording(requestId: string, record: boolean): Observable<void> {
    const url = `${
      this.endpointURL
    }/${requestId}/runtime_management/recording/${record ? 'start' : 'stop'}`;
    return this._http.post<void>(url, {});
  }

  /**
   * Accepts a request which is awaiting confirmation.
   * Administrator permission gets checked on the backend.
   *
   * @param requestId Reservation request ID.
   * @returns Observable of API response.
   */
  acceptRequest(requestId: string): Observable<Record<string, never>> {
    return this._http.post<Record<string, never>>(
      `${this.endpointURL}/${requestId}/accept`,
      {}
    );
  }

  /**
   * Rejects a request which is awaiting confirmation.
   * Administrator permission gets checked on the backend.
   *
   * @param requestId Reservation request ID.
   * @returns Observable of API response.
   */
  rejectRequest(requestId: string): Observable<Record<string, never>> {
    return this._http.post<Record<string, never>>(
      `${this.endpointURL}/${requestId}/reject`,
      {}
    );
  }
}
