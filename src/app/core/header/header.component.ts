import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ChangeDetectionStrategy } from '@angular/core';

interface MenuItem {
  label: string;
  route: string;
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
    { label: 'Nastavení', route: '' },
    { label: 'Nápověda', route: '' },
    { label: 'Dokumentace', route: '' },
    { label: 'Správa zdrojů', route: '' },
  ];

  isDropdownClosed = true;

  constructor() {}

  toggleDropdown(): void {
    this.isDropdownClosed = !this.isDropdownClosed;
  }
}
