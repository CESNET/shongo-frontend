import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ItemAuthorization } from 'src/app/models/enums/item-authorization.enum';
import { LocaleItem } from 'src/app/models/interfaces/locale-item.interface';
import { MenuItem } from 'src/app/models/interfaces/menu-item.interface';
import { Locale } from 'src/app/shared/models/enums/locale.enum';
import { Permission } from 'src/app/shared/models/enums/permission.enum';
import { AuthenticationService } from '../../authentication/authentication.service';
import { SettingsService } from '../../http/settings/settings.service';
import { LocaleService } from '../../services/locale.service';
import { locales, menuItems } from './header-items';

/**
 * App header.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dropdown', [
      state('closed', style({ height: '0' })),
      state('open', style({ height: '*' })),
      transition('open <=> closed', animate('200ms ease')),
    ]),
  ],
})
export class HeaderComponent implements OnDestroy {
  menuItems = menuItems;
  locales = locales;
  isDropdownClosed = true;

  private _destroy$ = new Subject<void>();

  constructor(
    public auth: AuthenticationService,
    public settings: SettingsService,
    private _locale: LocaleService
  ) {}

  get currentLocale(): LocaleItem {
    const locale = this._locale.currentLocale;
    return this.locales.find((loc) => loc.value === locale)!;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Returns users full name or falls back to 'Unknown user'.
   *
   * @returns User's full name.
   */
  getUsername(): string {
    return (
      this.auth.identityClaims?.name ??
      $localize`:user name fallback:Unknown user`
    );
  }

  /**
   * Opens navigation drop down menu (on mobile).
   */
  toggleDropdown(): void {
    this.isDropdownClosed = !this.isDropdownClosed;
  }

  /**
   * Returns observable which says if user is authorized to view given menu item.
   *
   * @param item Menu item.
   * @returns Observable of authorization state.
   */
  getAuthGuard(item: MenuItem): Observable<boolean> {
    switch (item.itemAuth) {
      case ItemAuthorization.LOGGED_IN:
        return this.auth.isAuthenticated$.pipe(takeUntil(this._destroy$));
      case ItemAuthorization.LOGGED_OUT:
        return this.auth.isAuthenticated$.pipe(
          map((value) => !value),
          takeUntil(this._destroy$)
        );
      case ItemAuthorization.ADMIN:
        return this.settings.userSettings$.pipe(
          map((userSettings) => {
            if (userSettings && userSettings.permissions) {
              return userSettings.permissions.includes(
                Permission.ADMINISTRATOR
              );
            } else {
              return false;
            }
          }),
          takeUntil(this._destroy$)
        );
      default:
        return of(true);
    }
  }

  /**
   * Saves selected locale to session storage.
   */
  onSelectLocale(locale: Locale): void {
    this._locale.sessionLocale = locale;
  }
}
