import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { Option } from 'src/app/shared/models/interfaces/option.interface';
import { UserSettings } from 'src/app/shared/models/rest-api/user-settings.interface';

@Component({
  selector: 'app-user-settings-page',
  templateUrl: './user-settings-page.component.html',
  styleUrls: ['./user-settings-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsPageComponent implements OnInit, OnDestroy {
  readonly languageOptions: Option[] = [
    {
      displayName: $localize`:option name:Use your operating system's configuration`,
      value: 'os',
    },
    { displayName: $localize`:language:Czech`, value: 'cz' },
    { displayName: $localize`:language:English`, value: 'en' },
  ];

  readonly useCurrentTimeZoneCtrl = new UntypedFormControl(false);
  readonly usePerunSettingsCtrl = new UntypedFormControl(false);
  readonly administrationModeCtrl = new UntypedFormControl(false);

  readonly settingsForm = new UntypedFormGroup({
    locale: new UntypedFormControl(''),
    homeTimeZone: new UntypedFormControl(''),
    currentTimeZone: new UntypedFormControl({
      value: '',
      disabled: true,
    }),
  });

  private readonly _destroy$ = new Subject<void>();

  constructor(public settings: SettingsService) {}

  ngOnInit(): void {
    this._observeUsePerunSettings();
    this._observeUserSettings();
    this._observeCurrentTimezone();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Updated user settings on the backend.
   */
  submitSettings(): void {
    this.settings.updateSettings(this._getUserSettings());
  }

  /**
   * Gets user settings object based on form value.
   *
   * @returns User settings.
   */
  private _getUserSettings(): UserSettings {
    const userSettings = this.settingsForm.value as UserSettings;
    userSettings.useWebService = this.usePerunSettingsCtrl.value;
    userSettings.administrationMode = this.administrationModeCtrl.value;

    if (!this.useCurrentTimeZoneCtrl.value) {
      delete userSettings.currentTimeZone;
    }
    if (this.usePerunSettingsCtrl.value) {
      delete userSettings.homeTimeZone;
      delete userSettings.locale;
    }

    return userSettings;
  }

  /**
   * Observes user settings observable and updates form value accordingly.
   */
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

          this.useCurrentTimeZoneCtrl.setValue(
            userSettings.currentTimeZone != null,
            { emitEvent: false }
          );
          this.usePerunSettingsCtrl.setValue(userSettings.useWebService, {
            emitEvent: false,
          });
          this.administrationModeCtrl.setValue(
            userSettings.administrationMode,
            { emitEvent: false }
          );

          const usePerunSettings = userSettings.useWebService ?? false;

          this._handleCurrentTimezoneEnabled(
            userSettings.currentTimeZone != null
          );
          this._handlePerunEnabled(!usePerunSettings);
        }
      });
  }

  /**
   * Observes current timezone checkbox and enables/disables timezone field accordingly.
   */
  private _observeCurrentTimezone(): void {
    this.useCurrentTimeZoneCtrl.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((isChecked) => this._handleCurrentTimezoneEnabled(isChecked));
  }

  /**
   * Observes use perun settings control value and enables/disables fields accordingly.
   */
  private _observeUsePerunSettings(): void {
    this.usePerunSettingsCtrl.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((isChecked) => this._handlePerunEnabled(!isChecked));
  }

  /**
   * Enables/disables locale and home time zone fields based on use perun settings checkbox value.
   *
   * @param isEnabled Whether use perun settings checkbox is enabled.
   */
  private _handlePerunEnabled(isEnabled: boolean): void {
    this._setControlEnabled(this.settingsForm.get('locale')!, isEnabled);
    this._setControlEnabled(this.settingsForm.get('homeTimeZone')!, isEnabled);
  }

  /**
   * Enables/disables current time zone field based on use current time zone checkbox value.
   *
   * @param isEnabled Whether use current time zone checkbox is enabled
   */
  private _handleCurrentTimezoneEnabled(isEnabled: boolean) {
    this._setControlEnabled(
      this.settingsForm.get('currentTimeZone')!,
      isEnabled
    );
  }

  /**
   * Enables/disables form control.
   *
   * @param control Form control.
   * @param enabled Whether form control should be enabled.
   */
  private _setControlEnabled(control: AbstractControl, enabled: boolean): void {
    if (enabled) {
      control.enable({ emitEvent: false });
    } else {
      control.disable({ emitEvent: false });
    }
  }
}
