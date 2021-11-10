import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

const AUTH_CONFIG: AuthConfig = {
  issuer: 'https://login.cesnet.cz/oidc/',
  redirectUri: window.location.origin + '/oauth2callback',
  clientId: '49ae627d-7b2e-4052-8421-bcc16ee0c3d6',
  responseType: 'code',
  scope:
    'openid email profile address organization offline_access eduperson_entitlement voperson_external_id isCesnetEligibleLastSeen',
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
