import { Component, Inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TableSettings } from '../filter/data-table-filter';

export const VALUE_PROVIDER = new InjectionToken<string>('column.value');
export const SETTINGS_PROVIDER = new InjectionToken<string>('column.settings');

@Component({
  template: '',
})
export class ColumnComponent {
  value: string;
  settings: Observable<TableSettings>;

  constructor(
    @Inject(VALUE_PROVIDER) value: string,
    @Inject(VALUE_PROVIDER) settings: Observable<TableSettings>
  ) {
    this.value = value;
    this.settings = settings;
  }
}
