import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  finalize,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { Locale } from 'src/app/shared/models/enums/locale.enum';
import { Permission } from 'src/app/shared/models/enums/permission.enum';
import { UserSettings } from 'src/app/shared/models/rest-api/user-settings.interface';
import { AuthenticationService } from '../../authentication/authentication.service';
import { AlertService } from '../../services/alert.service';
import { ApiService } from '../api.service';

const SETTINGS_LOCALSTORAGE_KEY = 'userSettings';

/**
 * Service for managing user settings.
 */
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  /**
   * Observable of current user settings.
   */
  userSettings$: Observable<UserSettings | null>;

  /**
   * Implies if user settings are being loaded.
   */
  userSettingsLoading$: Observable<boolean>;

  private _userSettings$ = new BehaviorSubject<UserSettings | null>(null);
  private _userSettingsLoading$ = new BehaviorSubject(false);

  constructor(
    private _http: HttpClient,
    private _auth: AuthenticationService,
    private _alert: AlertService
  ) {
    this._loadSettingsFromStorage();

    this.userSettingsLoading$ = this._userSettingsLoading$.asObservable();
    this.userSettings$ = this._userSettings$.asObservable();

    this._observeIsAuthenticated();
    this._observeSettings();
  }

  /**
   * Returns current user settings.
   */
  get userSettings(): UserSettings | null {
    return this._userSettings$.value;
  }

  /**
   * Checks if current user has administrator permission.
   */
  get isAdmin(): boolean {
    return (
      this.userSettings?.permissions?.includes(Permission.ADMINISTRATOR) ??
      false
    );
  }

  /**
   * Checks if current user has reservation permission.
   * If
   */
  get canReserve(): boolean {
    return (
      this.userSettings?.permissions?.includes(Permission.RESERVATION) ?? false
    );
  }

  /**
   * Returns timezone information based on this logic:
   *
   * - If user doesn't want to use information from Perun:
   *   - Current time zone > home time zone > Perun time zone
   * - If user want to use information from Perun:
   *   - Use Perun time zone
   * - If none of these is available, guess the timezone with Moment
   */
  get timeZone(): string | undefined {
    if (this.userSettings && !this.userSettings.useWebService) {
      const { homeTimeZone, currentTimeZone } = this.userSettings;

      if (homeTimeZone || currentTimeZone) {
        return currentTimeZone ?? homeTimeZone;
      }
    }

    return this._auth.identityClaims?.zoneInfo ?? moment.tz.guess();
  }

  /**
   * Gets offset of used timezone.
   */
  get timeZoneOffset(): string | undefined {
    const timezone = this.timeZone;

    if (timezone) {
      return moment.tz(timezone).format('Z');
    }
    return undefined;
  }

  get locale(): Locale | null {
    let locale: string | null;

    if (!this.userSettings?.useWebService && this.userSettings?.locale) {
      locale = this.userSettings?.locale;
    } else {
      locale = this._auth.identityClaims?.locale ?? null;
    }

    if (['cs', 'cz'].includes(locale)) {
      return Locale.CS;
    } else if (locale) {
      return Locale.EN;
    }

    return null;
  }

  /**
   * LOA = 2
   * - If cesnet employee confirmed his authorization by logging in at most 1 year ago.
   */
  get loa(): 0 | 1 | 2 {
    const isCesnetEligibleLastSeen =
      this._auth.identityClaims?.isCesnetEligibleLastSeen;
    const acceptableDifference = 365 * 24 * 60 * 60 * 1000;

    if (isCesnetEligibleLastSeen) {
      const timestamp = moment(isCesnetEligibleLastSeen);
      const timeElapsed = moment().diff(timestamp);

      if (timeElapsed <= acceptableDifference) {
        return 2;
      }
    }

    return 0;
  }

  /**
   * Clears user settings.
   */
  clearSettings(): void {
    this._userSettings$.next(null);
  }

  /**
   * Makes a request to update user settings.
   *
   * @param settings User settings.
   */
  updateSettings(settings: UserSettings): void {
    this._userSettingsLoading$.next(true);
    const url = ApiService.buildEndpointURL(Endpoint.SETTINGS, 'v1');

    this._http
      .put<UserSettings>(url, settings)
      .pipe(
        catchError((err) => {
          console.error('Failed to update user settings, reason: ', err);
          this._alert.showError($localize`Failed to update settings`);
          throw err;
        }),
        finalize(() => this._userSettingsLoading$.next(false))
      )
      .subscribe((userSettings) => {
        this._userSettings$.next(userSettings);
        this._alert.showSuccess($localize`Settings updated`);
      });
  }

  /**
   * Loads user settings from local storage.
   */
  private _loadSettingsFromStorage(): void {
    const settings = localStorage.getItem(SETTINGS_LOCALSTORAGE_KEY);

    if (settings) {
      this._userSettings$.next(JSON.parse(settings));
    }
  }

  /**
   * Fetches user settings from the backend (user permissions, timezone & locale settings).
   */
  private _fetchUserSettings(): Observable<UserSettings> {
    this._userSettingsLoading$.next(true);
    const url = ApiService.buildEndpointURL(Endpoint.SETTINGS, 'v1');

    return this._http.get<UserSettings>(url).pipe(
      catchError((err) => {
        this._userSettingsLoading$.next(false);
        console.error('Failed to fetch user settings, reason: ', err);
        throw new Error(
          $localize`:error message:Failed to fetch user settings`
        );
      })
    );
  }

  /**
   * Observes user authentication state, clears settings if user logs out, fetches settings after user authenticates.
   */
  private _observeIsAuthenticated(): void {
    this._auth.isAuthenticated$
      .pipe(
        distinctUntilChanged(),
        tap((isAuth) => {
          if (!isAuth) {
            this.clearSettings();
          }
        }),
        filter((isAuth) => isAuth),
        switchMap(() => this._fetchUserSettings())
      )
      .subscribe((userSettings) => {
        this._userSettings$.next(userSettings);
        this._userSettingsLoading$.next(false);
      });
  }

  /**
   * Observes changes to user settings and makes a call to handle these changes.
   */
  private _observeSettings(): void {
    this.userSettings$
      .pipe(filter((settings) => settings !== null))
      .subscribe((settings) => this._handleSettingsChange(settings!));
  }

  /**
   * Stores new settings and updates timezone/locale data in the app.
   *
   * @param settings User settings.
   */
  private _handleSettingsChange(settings: UserSettings | null): void {
    if (settings) {
      localStorage.setItem(SETTINGS_LOCALSTORAGE_KEY, JSON.stringify(settings));
      moment.tz.setDefault(this.timeZone);
    } else {
      localStorage.removeItem(SETTINGS_LOCALSTORAGE_KEY);
    }
  }
}
