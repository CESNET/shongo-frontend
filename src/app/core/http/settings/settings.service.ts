import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  userSettings$: Observable<UserSettings | null>;
  userSettingsLoading$: Observable<boolean>;

  private _userSettings$ = new BehaviorSubject<UserSettings | null>(null);
  private _userSettingsLoading$ = new BehaviorSubject(false);

  constructor(private _http: HttpClient, private _auth: AuthenticationService) {
    this.userSettingsLoading$ = this._userSettingsLoading$.asObservable();
    this.userSettings$ = this._userSettings$.asObservable();

    this._auth.isAuthenticated$
      .pipe(
        distinctUntilChanged(),
        filter((isAuth) => isAuth),
        switchMapTo(this._fetchUserSettings())
      )
      .subscribe((userSettings) => {
        this._userSettings$.next(userSettings);
        this._userSettingsLoading$.next(false);
      });
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
}
