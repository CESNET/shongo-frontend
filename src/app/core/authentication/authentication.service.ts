import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { IdentityClaims } from '../../shared/models/interfaces/identity-claims.interface';
import { MatDialog } from '@angular/material/dialog';
import { SessionEndedDialogComponent } from 'src/app/shared/components/session-ended-dialog/session-ended-dialog.component';
import { map } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';

const ERRORS_REQUIRING_USER_INTERACTION = [
  'interaction_required',
  'login_required',
  'account_selection_required',
  'consent_required',
];

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public isAuthenticated$: Observable<boolean>;
  private _isAuthenticated$ = new BehaviorSubject<boolean>(false);

  public isDoneLoading$: Observable<boolean>;
  private _isDoneLoading$ = new BehaviorSubject<boolean>(false);

  private _discoveryDocumentLoaded = false;

  constructor(
    private _oauthService: OAuthService,
    private _dialog: MatDialog,
    private _alert: AlertService
  ) {
    this.isAuthenticated$ = this._isAuthenticated$.asObservable();
    this.isDoneLoading$ = this._isDoneLoading$.asObservable();

    this._observeStorage();
    this._observeAuthEvents();

    this._oauthService.setupAutomaticSilentRefresh();
  }

  /**
   * Publishes `true` if and only if (a) all the asynchronous initial
   * login calls have completed or errorred, and (b) the user ended up
   * being authenticated.
   *
   * In essence, it combines:
   *
   * - the latest known state of whether the user is authorized
   * - whether the ajax calls for initial log in have all been done
   */
  get canActivateProtectedRoutes$(): Observable<boolean> {
    return combineLatest([this.isAuthenticated$, this.isDoneLoading$]).pipe(
      map((values) => values.every((val) => val))
    );
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

  displayLoginDialog(): void {
    this._dialog.open(SessionEndedDialogComponent, {
      width: '95%',
      maxWidth: '100ch',
    });
  }

  login(): void {
    if (this._discoveryDocumentLoaded) {
      this._oauthService.initCodeFlow();
    } else {
      this.initializeOauthService();
    }
  }

  logout(): void {
    this._oauthService.logOut();
  }

  initializeOauthService(): Promise<void> {
    console.log('initialize');

    this._isDoneLoading$.next(false);

    return this._oauthService
      .loadDiscoveryDocument()
      .then(() => this._oauthService.tryLogin())
      .then(() =>
        this.hasValidAccessToken() ? Promise.resolve() : Promise.reject()
      )
      .catch((error) => {
        // Require user to login manually if one of these errors occur.
        if (
          error?.reason?.error &&
          ERRORS_REQUIRING_USER_INTERACTION.includes(error.reason.error)
        ) {
          return Promise.resolve();
        }
        return Promise.reject(error);
      })
      .then(() => this._isDoneLoading$.next(true))
      .catch((error) => {
        this._isDoneLoading$.next(true);
        console.error('An error appeared during the log in process: ', error);
      });
  }

  hasValidAccessToken(): boolean {
    return this._oauthService.hasValidAccessToken();
  }

  private _observeAuthEvents(): void {
    this._oauthService.events.subscribe((e) => {
      this._isAuthenticated$.next(this.hasValidAccessToken());
      switch (e.type) {
        case 'session_error':
        case 'session_terminated':
          this.displayLoginDialog();
          break;
        case 'discovery_document_load_error':
        case 'discovery_document_validation_error':
          this._discoveryDocumentLoaded = false;
          this._alert.showError(
            $localize`:error message:Authentication process failed`
          );
          break;
        case 'discovery_document_loaded':
          this._discoveryDocumentLoaded = true;
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
