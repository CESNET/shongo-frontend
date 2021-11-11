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

interface MenuItem {
  label: string;
  showItem: ShowItem;
  route?: string;
  func?: () => void;
  subItems?: MenuItem[];
  subMenuOpen?: boolean;
}

interface Locale {
  shortcut: string;
  icon: string;
  route: string;
  name: string;
}

enum ShowItem {
  LOGGED_IN,
  LOGGED_OUT,
  BOTH,
}

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
  menuItems: MenuItem[] = [
    {
      label: $localize`:navbar link|Link to help page:Nápověda`,
      route: '/',
      showItem: ShowItem.BOTH,
    },
    {
      label: $localize`:navbar link|Link to documentation page:Dokumentace`,
      route: '/',
      showItem: ShowItem.BOTH,
    },
    {
      label: $localize`:navbar link|Link to resource management:Správa zdrojů`,
      route: '/',
      showItem: ShowItem.LOGGED_IN,
      subItems: [
        {
          label: $localize`:navbar link|Sublink in resource management:Využití kapacity zdrojů`,
          route: '/',
          showItem: ShowItem.LOGGED_IN,
        },
        {
          label: $localize`:navbar link|Sublink in resource management:Rezervace zdrojů`,
          route: '/',
          showItem: ShowItem.LOGGED_IN,
        },
      ],
    },
  ];

  accountItems: MenuItem[] = [
    {
      label: $localize`:navbar link|Sublink in account:Nastavení`,
      route: '/',
      showItem: ShowItem.LOGGED_IN,
    },
    {
      label: $localize`:navbar link|Sublink in account:Odhlásit se`,
      showItem: ShowItem.LOGGED_IN,
    },
  ];

  locales: Locale[] = [
    {
      shortcut: 'cz',
      icon: 'assets/img/i18n/CZ.svg',
      route: '/cz',
      name: $localize`:cz language|CZ language in locale picker:Český jazyk`,
    },
    {
      shortcut: 'en',
      icon: 'assets/img/i18n/GB.svg',
      route: '/en',
      name: $localize`:en language|EN language in locale picker:Anglický jazyk`,
    },
  ];

  defaultLocale = this.locales[0];
  isDropdownClosed = true;
  isAuthenticated = false;

  private _destroy$ = new Subject<void>();

  constructor(private _auth: AuthenticationService, private _cd: ChangeDetectorRef) {}

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
