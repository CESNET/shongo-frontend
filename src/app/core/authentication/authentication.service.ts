import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

const AUTH_CONFIG: AuthConfig = {
  issuer: 'https://login.cesnet.cz',
  redirectUri: window.location.origin + '/oauth2callback',
  clientId: '53af3802-6126-4230-b25a-aee088d9c1c1',
  responseType: 'code',
  scope: 'openid email profile address phone organization locale zoneinfo',
  showDebugInformation: true,
};

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private _oauthService: OAuthService) {
    this._oauthService.initCodeFlow();
    this._oauthService.configure(AUTH_CONFIG);
  }

  async login(): Promise<void> {
    await this._oauthService.loadDiscoveryDocumentAndTryLogin();
    console.log(this._oauthService.getIdToken());
  }
}
