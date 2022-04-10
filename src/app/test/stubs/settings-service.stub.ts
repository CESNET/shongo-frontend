import { BehaviorSubject, Observable } from 'rxjs';
import { UserSettings } from 'src/app/shared/models/rest-api/user-settings.interface';

export class SettingsServiceStub {
  userSettings$: Observable<UserSettings | null>;
  userSettingsLoading$: Observable<boolean>;

  isAdmin = false;
  canReserve = true;
  timezone = 'Europe/Bratislava';
  timezoneOffset = '+01:00';

  // For consistency with the subject.
  get userSettings(): UserSettings | null {
    return this._userSettings$.value;
  }

  private _userSettings$ = new BehaviorSubject<UserSettings | null>(null);
  private _userSettingsLoading$ = new BehaviorSubject(false);

  constructor() {
    this.userSettings$ = this._userSettings$.asObservable();
    this.userSettingsLoading$ = this._userSettingsLoading$.asObservable();
  }

  setUserSettings(value: UserSettings | null): void {
    this._userSettings$.next(value);
  }

  setUserSettingsLoading(isLoading: boolean): void {
    this._userSettingsLoading$.next(isLoading);
  }
}
