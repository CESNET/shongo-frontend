import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { IANA_TIMEZONES } from 'src/app/shared/models/data/timezones';
import { Permission } from 'src/app/shared/models/enums/permission.enum';
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

  useCurrentTimeZoneCtrl = new FormControl(false);
  homeTimeZoneFilterCtrl = new FormControl('');
  currentTimeZoneFilterCtrl = new FormControl('');
  usePerunSettingsCtrl = new FormControl(false);
  administrationModeCtrl = new FormControl(false);

  settingsForm = new FormGroup({
    locale: new FormControl(''),
    homeTimeZone: new FormControl(''),
    currentTimeZone: new FormControl({
      value: '',
      disabled: true,
    }),
  });

  private _destroy$ = new Subject<void>();

  constructor(public settings: SettingsService) {}

  ngOnInit(): void {
    this._initTimeZoneFilter(this.homeTimeZoneFilterCtrl);
    this._initTimeZoneFilter(this.currentTimeZoneFilterCtrl);
    this._observeUsePerunSettings();
    this._observeUserSettings();
    this._observeCurrentTimezone();
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

    if (this.settings.isAdmin) {
      userSettings.administrationMode = this.administrationModeCtrl.value;
    }
    if (!this.useCurrentTimeZoneCtrl.value) {
      delete userSettings.currentTimeZone;
    }
    if (this.usePerunSettingsCtrl.value) {
      delete userSettings.homeTimeZone;
      delete userSettings.locale;
    }

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
            administrationMode: userSettings.administrationMode,
          });

          this.useCurrentTimeZoneCtrl.setValue(
            userSettings.currentTimeZone != null,
            { emitEvent: false }
          );
          this.usePerunSettingsCtrl.setValue(userSettings.useWebService, {
            emitEvent: false,
          });

          const usePerunSettings = userSettings.useWebService ?? false;

          this._handleCurrentTimezoneEnabled(
            userSettings.currentTimeZone != null
          );
          this._handlePerunEnabled(!usePerunSettings);
        }
      });
  }

  private _observeCurrentTimezone(): void {
    this.useCurrentTimeZoneCtrl.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((isChecked) => this._handleCurrentTimezoneEnabled(isChecked));
  }

  private _observeUsePerunSettings(): void {
    this.usePerunSettingsCtrl.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((isChecked) => this._handlePerunEnabled(!isChecked));
  }

  private _handlePerunEnabled(isEnabled: boolean): void {
    this._setControlEnabled(this.settingsForm.get('locale')!, isEnabled);
    this._setControlEnabled(this.settingsForm.get('homeTimeZone')!, isEnabled);
  }

  private _handleCurrentTimezoneEnabled(isEnabled: boolean) {
    this._setControlEnabled(
      this.settingsForm.get('currentTimeZone')!,
      isEnabled
    );
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

  private _setControlEnabled(control: AbstractControl, enabled: boolean): void {
    if (enabled) {
      control.enable({ emitEvent: false });
    } else {
      control.disable({ emitEvent: false });
    }
  }
}
