import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  switchMapTo,
  tap,
} from 'rxjs/operators';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { Permission } from 'src/app/shared/models/enums/permission.enum';
import { UserSettings } from 'src/app/shared/models/rest-api/user-settings.interface';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ApiService } from '../api.service';

const SETTINGS_LOCALSTORAGE_KEY = 'userSettings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  userSettings$: Observable<UserSettings | null>;
  userSettingsLoading$: Observable<boolean>;

  private _userSettings$ = new BehaviorSubject<UserSettings | null>(null);
  private _userSettingsLoading$ = new BehaviorSubject(false);

  constructor(private _http: HttpClient, private _auth: AuthenticationService) {
    this._loadSettingsFromStorage();

    this.userSettingsLoading$ = this._userSettingsLoading$.asObservable();
    this.userSettings$ = this._userSettings$.asObservable();

    this._observeIsAuthenticated();
    this._observeSettings();
  }

  get userSettings(): UserSettings | null {
    return this._userSettings$.value;
  }

  get isAdmin(): boolean {
    return (
      this.userSettings?.permissions?.includes(Permission.ADMINISTRATOR) ??
      false
    );
  }

  get timeZone(): string | undefined {
    return (
      this.userSettings?.currentTimeZone ?? this.userSettings?.homeTimeZone
    );
  }

  clearSettings(): void {
    this._userSettings$.next(null);
  }

  updateSettings(settings: UserSettings): void {
    this._userSettingsLoading$.next(true);
    const url = ApiService.buildEndpointURL(Endpoint.SETTINGS, 'v1');

    this._http
      .put<UserSettings>(url, settings)
      .pipe(
        catchError((err) => {
          this._userSettings$.next(settings);
          this._userSettingsLoading$.next(false);
          console.error('Failed to update user settings, reason: ', err);
          return throwError(() => new Error('Failed to update user settings.'));
        })
      )
      .subscribe((userSettings) => {
        this._userSettings$.next(userSettings);
        this._userSettingsLoading$.next(false);
      });
  }

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
        return throwError(() => new Error('Failed to fetch user settings.'));
      })
    );
  }

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
        switchMapTo(this._fetchUserSettings())
      )
      .subscribe((userSettings) => {
        this._userSettings$.next(userSettings);
        this._userSettingsLoading$.next(false);
      });
  }

  private _observeSettings(): void {
    this.userSettings$
      .pipe(filter((settings) => settings !== null))
      .subscribe((settings) => this._handleSettingsChange(settings!));
  }

  private _handleSettingsChange(settings: UserSettings | null): void {
    if (settings) {
      localStorage.setItem(SETTINGS_LOCALSTORAGE_KEY, JSON.stringify(settings));

      if (settings.currentTimeZone) {
        this._handleTimezoneChange(settings.currentTimeZone);
      } else if (settings.homeTimeZone) {
        this._handleTimezoneChange(settings.homeTimeZone);
      }

      if (settings.locale) {
        this._handleLocaleChange(settings.locale);
      }
    } else {
      localStorage.removeItem(SETTINGS_LOCALSTORAGE_KEY);
    }
  }

  private _handleTimezoneChange(timezone: string): void {
    moment.tz.setDefault(timezone);
  }

  private _handleLocaleChange(locale: 'cs' | 'en'): void {
    moment.locale(locale);
  }
}
