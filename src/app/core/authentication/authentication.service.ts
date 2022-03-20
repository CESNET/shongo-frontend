import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable } from 'rxjs';
import { IdentityClaims } from '../../shared/models/interfaces/identity-claims.interface';
import { UserService } from '../http/user/user.service';
import { UserSettings } from 'src/app/shared/models/rest-api/user-settings.interface';
import { MatDialog } from '@angular/material/dialog';
import { SessionEndedDialogComponent } from 'src/app/shared/components/session-ended-dialog/session-ended-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public isAuthenticated$: Observable<boolean>;

  private _isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private _userSettings?: UserSettings;

  constructor(
    private _oauthService: OAuthService,
    private _userService: UserService,
    private _dialog: MatDialog
  ) {
    this.isAuthenticated$ = this._isAuthenticated$.asObservable();

    this._observeStorage();
    this._observeAuthEvents();

    // Initialize silent refresh
    this._oauthService.setupAutomaticSilentRefresh();

    if (this.hasValidAccessToken() && !this.userSettings) {
      this._fetchUserSettings();
    }
  }

  displayLoginDialog(): void {
    this._dialog.open(SessionEndedDialogComponent, {
      width: '95%',
      maxWidth: '100ch',
    });
  }

  login(): void {
    this._oauthService.initCodeFlow();
  }

  logout(): void {
    this._oauthService.logOut();
  }

  async initializeOauthService(): Promise<void> {
    await this._oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  hasValidAccessToken(): boolean {
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
  get userSettings(): UserSettings | undefined {
    return this._userSettings;
  }

  /**
   * Fetches user settings from the backend (user permissions, timezone & locale settings).
   */
  private _fetchUserSettings(): void {
    this._userService
      .fetchSettings()
      .subscribe((settings) => (this._userSettings = settings));
  }

  private _observeAuthEvents(): void {
    this._oauthService.events.subscribe((e) => {
      this._isAuthenticated$.next(this.hasValidAccessToken());

      switch (e.type) {
        case 'session_error':
        case 'session_terminated':
          this.displayLoginDialog();
          break;
        case 'token_received':
          this._fetchUserSettings();
          break;
        default:
          break;
      }
    });
  }

  /**
   * Checks the change in session storage for log out/in from another tab.
   */
  private _observeStorage(): void {
    window.addEventListener('storage', (e) => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (e.key !== 'access_token' && e.key !== null) {
        return;
      }

      console.warn(
        'Noticed changes to access_token (most likely from another tab), updating isAuthenticated'
      );
      this._isAuthenticated$.next(this.hasValidAccessToken());

      if (!this.hasValidAccessToken()) {
        this.displayLoginDialog();
      }
    });
  }
}
