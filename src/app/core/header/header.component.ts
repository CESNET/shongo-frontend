import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';

interface MenuItem {
  label: string;
  route: string;
  showItem: ShowItem;
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
export class HeaderComponent {
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
      route: '',
      showItem: ShowItem.LOGGED_IN,
    },
    {
      label: $localize`:navbar link|Sublink in account:Odhlásit se`,
      route: '',
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
  userLoggedIn = false;

  constructor(private _auth: AuthenticationService) {}

  login(): void {
    this._auth.login();
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
          return this.userLoggedIn;
        case ShowItem.LOGGED_OUT:
          return !this.userLoggedIn;
      }
      return true;
    });
  }
}
