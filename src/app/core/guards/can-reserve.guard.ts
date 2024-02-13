import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../http/settings/settings.service';

/**
 * Checks for RESERVATION user permission.
 */
@Injectable({
  providedIn: 'root',
})
export class CanReserveGuard {
  constructor(private _settings: SettingsService, private _router: Router) {}

  canLoad(): boolean {
    return this._handleGuard();
  }

  canActivate(): boolean {
    return this._handleGuard();
  }

  private _handleGuard(): boolean {
    if (this._settings.canReserve) {
      return true;
    } else {
      this._router.navigate(['unauthorized']);
      return false;
    }
  }
}
