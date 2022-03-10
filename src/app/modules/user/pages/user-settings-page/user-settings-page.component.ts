import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IANA_TIMEZONES } from 'src/app/shared/models/data/timezones';
import { Option } from 'src/app/shared/models/interfaces/option.interface';

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
    user: new FormControl(''),
    language: new FormControl(''),
    homeTimeZone: new FormControl(''),
    homeTimeZoneFilter: new FormControl(''),
    currentTimeZone: new FormControl({ value: '', disabled: true }),
    currentTimeZoneFilter: new FormControl(''),
    usePerunSettings: new FormControl(false),
  });

  private _destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    const { homeTimeZoneFilter, currentTimeZoneFilter } = this.settingsForm
      .controls as Record<string, FormControl>;
    this._initTimeZoneFilter(homeTimeZoneFilter);
    this._initTimeZoneFilter(currentTimeZoneFilter);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
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
