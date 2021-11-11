import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { authConfig } from './auth-config';
import { IdentityClaims } from './identity-claims';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  constructor(private _oauthService: OAuthService) {
    this.initializeOauthService();

    this._oauthService.events.subscribe((_) => {
      this.isAuthenticatedSubject$.next(
        this._oauthService.hasValidAccessToken()
      );
    });
  }

  login(): void {
    this._oauthService.initCodeFlow();
  }
  logout() {
    this._oauthService.logOut();
  }

  async initializeOauthService(): Promise<void> {
    this._oauthService.configure(authConfig);
    await this._oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  hasValidToken() {
    return this._oauthService.hasValidAccessToken();
  }

  get idToken(): string {
    return this._oauthService.getIdToken();
  }
  get accessToken(): string {
    return this._oauthService.getAccessToken();
  }
  get refreshToken(): string {
    return this._oauthService.getRefreshToken();
  }
  get identityClaims(): IdentityClaims | null {
    return this._oauthService.getIdentityClaims() as IdentityClaims;
  }
}
