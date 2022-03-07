import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import {
  accountItems,
  locales,
  MenuItem,
  menuItems,
  ItemAuthorization,
} from './header-items';

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
export class HeaderComponent implements OnInit, OnDestroy {
  menuItems = menuItems;
  accountItems = accountItems;
  locales = locales;
  defaultLocale = this.locales[0];
  isDropdownClosed = true;

  private _destroy$ = new Subject<void>();

  constructor(public auth: AuthenticationService) {}

  ngOnInit(): void {
    this.accountItems[1].func = () => this.logOut();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  logIn(): void {
    this.auth.login();
  }

  logOut(): void {
    this.auth.logout();
  }

  getUsername(): string {
    return this.auth.identityClaims?.name ?? 'Unknown user';
  }

  toggleDropdown(): void {
    this.isDropdownClosed = !this.isDropdownClosed;
  }

  filterAuthorizedItems(
    items: MenuItem[] | undefined,
    isAuthenticated: boolean
  ): MenuItem[] {
    if (!items) {
      return [];
    }
    return items.filter((item) => {
      switch (item.itemAuth) {
        case ItemAuthorization.LOGGED_IN:
          return isAuthenticated;
        case ItemAuthorization.LOGGED_OUT:
          return !isAuthenticated;
      }
      return true;
    });
  }
}
