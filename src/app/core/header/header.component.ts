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
    { label: 'Nápověda', route: '/', showItem: ShowItem.BOTH },
    { label: 'Dokumentace', route: '/', showItem: ShowItem.BOTH },
    {
      label: 'Správa zdrojů',
      route: '/',
      showItem: ShowItem.LOGGED_IN,
      subItems: [
        {
          label: 'Využití kapacity zdrojů',
          route: '/',
          showItem: ShowItem.LOGGED_IN,
        },
        { label: 'Rezervace zdrojů', route: '/', showItem: ShowItem.LOGGED_IN },
      ],
    },
  ];

  accountItems: MenuItem[] = [
    { label: 'Nastavení', route: '', showItem: ShowItem.LOGGED_IN },
    { label: 'Odhlásit se', route: '', showItem: ShowItem.LOGGED_IN },
  ];

  isDropdownClosed = true;
  userLoggedIn = false;

  constructor(private _auth: AuthenticationService) {}

  login(): void {
    this._auth.login();
  }

  toggleDropdown(): void {
    this.isDropdownClosed = !this.isDropdownClosed;
  }

  filterAuthorizedItems(items: MenuItem[]): MenuItem[] {
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
