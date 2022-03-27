import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { SettingsService } from '../http/settings/settings.service';

@Injectable({
  providedIn: 'root',
})
export class IsAdminGuard implements CanLoad {
  constructor(private _settings: SettingsService, private _router: Router) {}

  canLoad(): boolean {
    if (this._settings.userSettings) {
      return true;
    } else {
      this._router.navigate(['unauthorized']);
      return false;
    }
  }
}
