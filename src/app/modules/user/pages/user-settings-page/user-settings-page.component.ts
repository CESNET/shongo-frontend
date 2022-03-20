import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { IANA_TIMEZONES } from 'src/app/shared/models/data/timezones';
import { Option } from 'src/app/shared/models/interfaces/option.interface';
import { UserSettings } from 'src/app/shared/models/rest-api/user-settings.interface';

@Component({
  selector: 'app-user-settings-page',
  templateUrl: './user-settings-page.component.html',
  styleUrls: ['./user-settings-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsPageComponent implements OnInit, OnDestroy {
  languageOptions: Option[] = [
    { displayName: `Use your operating system's configuration`, value: 'os' },
    { displayName: `Czech`, value: 'cz' },
    { displayName: `English`, value: 'en' },
  ];
  timezoneOptions = IANA_TIMEZONES;
  filteredHomeTimezones = this.timezoneOptions;
  filteredCurrentTimezones = this.timezoneOptions;

  settingsForm = new FormGroup({
    locale: new FormControl(''),
    homeTimeZone: new FormControl(''),
    currentTimeZone: new FormControl({ value: '', disabled: true }),
  });

  useCurrentTimeZoneCtrl = new FormControl(false);
  homeTimeZoneFilterCtrl = new FormControl('');
  currentTimeZoneFilterCtrl = new FormControl('');
  usePerunSettingsCtrl = new FormControl(false);

  private _destroy$ = new Subject<void>();

  constructor(public settings: SettingsService) {}

  ngOnInit(): void {
    this._initTimeZoneFilter(this.homeTimeZoneFilterCtrl);
    this._initTimeZoneFilter(this.currentTimeZoneFilterCtrl);
    this._observeUsePerunSettings();
    this._observeUserSettings();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  submitSettings(): void {
    this.settings.updateSettings(this._getUserSettings());
  }

  private _getUserSettings(): UserSettings {
    const userSettings = this.settingsForm.value as UserSettings;
    userSettings.useWebService = this.usePerunSettingsCtrl.value;

    return userSettings;
  }

  private _observeUserSettings(): void {
    this.settings.userSettingsLoading$
      .pipe(
        takeUntil(this._destroy$),
        filter((isLoading) => !isLoading)
      )
      .subscribe(() => {
        const userSettings = this.settings.userSettings;

        if (userSettings) {
          this.settingsForm.patchValue({
            locale: userSettings.locale,
            homeTimeZone: userSettings.homeTimeZone,
            currentTimeZone: userSettings.currentTimeZone,
          });

          if (userSettings.currentTimeZone != null) {
            this.useCurrentTimeZoneCtrl.setValue(true);
            this.settingsForm.get('currentTimeZone')!.enable();
          } else {
            this.useCurrentTimeZoneCtrl.setValue(false);
            this.settingsForm.get('currentTimeZone')!.disable();
          }

          this.usePerunSettingsCtrl.setValue(userSettings.useWebService);
        }
      });
  }

  private _observeUsePerunSettings(): void {
    this.usePerunSettingsCtrl.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((isChecked) => this._setSettingsFormEnabled(!isChecked));
  }

  private _setSettingsFormEnabled(isEnabled: boolean): void {
    if (isEnabled) {
      this.settingsForm.enable();
      this.useCurrentTimeZoneCtrl.enable();
    } else {
      this.settingsForm.disable();
      this.useCurrentTimeZoneCtrl.disable();
    }
  }

  private _filterTimeZones(filter: string): void {
    this.filteredHomeTimezones = this.timezoneOptions.filter((timeZone) =>
      timeZone.label.toLowerCase().includes(filter.toLowerCase())
    );
  }

  private _initTimeZoneFilter(filterControl: FormControl): void {
    filterControl.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((filter) => {
        this._filterTimeZones(filter);
      });
  }
}
