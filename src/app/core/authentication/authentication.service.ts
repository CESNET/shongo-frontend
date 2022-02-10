import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { authConfig } from './auth-config';
import { IdentityClaims } from './identity-claims';
import { environment } from 'src/environments/environment';
import {
  mockAccessToken,
  mockIdentityClaims,
  mockRefreshToken,
} from './mock-auth-data';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  constructor(private _oauthService: OAuthService) {
    this.initializeOauthService();

    if (environment.production) {
      this._oauthService.events.subscribe(() => {
        this.isAuthenticatedSubject$.next(
          this._oauthService.hasValidAccessToken()
        );
      });
    } else {
      this.isAuthenticatedSubject$.next(true);
    }
  }

  login(): void {
    this._oauthService.initCodeFlow();
  }
  logout(): void {
    this._oauthService.logOut();
  }

  async initializeOauthService(): Promise<void> {
    this._oauthService.configure(authConfig);
    await this._oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  hasValidToken(): boolean {
    if (environment.production) {
      return this._oauthService.hasValidAccessToken();
    }
    return true;
  }

  get idToken(): string {
    if (environment.production) {
      return this._oauthService.getIdToken();
    }
    return mockAccessToken;
  }
  get accessToken(): string {
    if (environment.production) {
      return this._oauthService.getAccessToken();
    }
    return mockAccessToken;
  }
  get refreshToken(): string {
    if (environment.production) {
      return this._oauthService.getRefreshToken();
    }
    return mockRefreshToken;
  }
  get identityClaims(): IdentityClaims | null {
    if (environment.production) {
      return this._oauthService.getIdentityClaims() as IdentityClaims;
    }
    return mockIdentityClaims;
  }
}
