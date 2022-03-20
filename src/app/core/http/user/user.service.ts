import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { UserSettings } from 'src/app/shared/models/rest-api/user-settings.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiService {
  constructor(protected _http: HttpClient) {
    super(_http, Endpoint.USER, 'v1');
  }

  fetchSettings(): Observable<UserSettings> {
    const url = ApiService.buildEndpointURL(Endpoint.SETTINGS, 'v1');
    return this._http.get<UserSettings>(url);
  }
}
