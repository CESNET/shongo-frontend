import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { filter, first } from 'rxjs';
import { Locale } from 'src/app/shared/models/enums/locale.enum';
import { environment } from 'src/environments/environment';
import { SettingsService } from '../http/settings/settings.service';

const LOCALE_KEY = 'locale';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  constructor(private _router: Router, private _settings: SettingsService) {
    this._settings.userSettings$.pipe(filter(Boolean)).subscribe(() => {
      this._useExpectedLocale();
      moment.locale(this.currentLocale);
    });
  }

  get currentLocale(): Locale {
    return $localize`:locale:en` as Locale;
  }

  get settingsLocale(): Locale | null {
    return this._settings.locale;
  }

  get sessionLocale(): Locale | null {
    return window.sessionStorage.getItem(LOCALE_KEY) as Locale;
  }

  set sessionLocale(locale: Locale | null) {
    if (locale === this.currentLocale) {
      return;
    }

    if (locale) {
      window.sessionStorage.setItem(LOCALE_KEY, locale);
      this._useLocale(locale);
    } else if (this.settingsLocale) {
      window.sessionStorage.removeItem(LOCALE_KEY);
      this._useLocale(this.settingsLocale);
    } else {
      window.sessionStorage.removeItem(LOCALE_KEY);
    }
  }

  private _useLocale(locale: Locale): void {
    window.location.assign(`/${locale}${this._router.url}`);
  }

  private _useExpectedLocale() {
    const expectedLocale =
      this.sessionLocale || this.settingsLocale || Locale.EN;

    if (this.currentLocale !== expectedLocale && environment.production) {
      this._useLocale(expectedLocale);
    }
  }
}
