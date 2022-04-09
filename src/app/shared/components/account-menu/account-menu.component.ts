import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { accountMenuItems } from './account-menu-items';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountMenuComponent implements OnInit {
  accountItems = accountMenuItems;

  constructor(
    public auth: AuthenticationService,
    public settings: SettingsService
  ) {}

  ngOnInit(): void {
    this.accountItems[1].func = () => this.auth.logout();
  }

  getUsername(): string {
    return (
      this.auth.identityClaims?.name ??
      $localize`:user name fallback:Unknown user`
    );
  }
}
