import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportMetadata } from 'src/app/models/interfaces/report-metadata.interface';
import { Report } from 'src/app/models/interfaces/report.interface';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ApiService } from '../api.service';
import { SettingsService } from '../settings/settings.service';

/**
 * Service for interaction with report endpoint.
 */
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  endpointUrl: string;

  constructor(
    private _settings: SettingsService,
    private _http: HttpClient,
    private _auth: AuthenticationService
  ) {
    this.endpointUrl = ApiService.buildEndpointURL(Endpoint.REPORT, 'v1');
  }

  get reportMetadata(): ReportMetadata {
    const timezone = this._settings.timeZone;
    const settings = this._settings.userSettings;
    const metadata: ReportMetadata = {
      user: this._auth.identityClaims?.name,
      timezone,
      settings: settings ?? undefined,
    };

    return metadata;
  }

  report({
    email,
    message,
  }: {
    email: string;
    message: string;
  }): Observable<unknown> {
    const meta = this.reportMetadata;
    const report: Report = { email, meta, message };

    return this._http.post<unknown>(this.endpointUrl, report);
  }
}
