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
  ShowItem,
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
  isAuthenticated = false;

  private _destroy$ = new Subject<void>();

  constructor(
    private _auth: AuthenticationService,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._auth.isAuthenticated$
      .pipe(takeUntil(this._destroy$))
      .subscribe((isAuthenticated) => {
        if (this.isAuthenticated !== isAuthenticated) {
          this.isAuthenticated = isAuthenticated;
          this._cd.detectChanges();
        }
      });

    this.accountItems[1].func = () => this.logOut();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  logIn(): void {
    this._auth.login();
  }

  logOut(): void {
    this._auth.logout();
  }

  getUsername(): string {
    return this._auth.identityClaims?.name ?? 'Unknown user';
  }

  toggleDropdown(): void {
    this.isDropdownClosed = !this.isDropdownClosed;
  }

  filterAuthorizedItems(items: MenuItem[] | undefined): MenuItem[] {
    if (!items) {
      return [];
    }
    return items.filter((item) => {
      switch (item.showItem) {
        case ShowItem.LOGGED_IN:
          return this.isAuthenticated;
        case ShowItem.LOGGED_OUT:
          return !this.isAuthenticated;
      }
      return true;
    });
  }
}
