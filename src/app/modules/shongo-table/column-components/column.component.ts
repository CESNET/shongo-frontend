import { Component, Inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TableSettings } from '../filter/data-table-filter';
import { ColumnData } from '../models/interfaces/column-data.interface';

export const COL_DATA_PROVIDER = new InjectionToken<string>('column.value');
export const SETTINGS_PROVIDER = new InjectionToken<string>('column.settings');

@Component({
  template: '',
})
export class ColumnComponent<T> {
  constructor(
    @Inject(COL_DATA_PROVIDER) public columnData: ColumnData<T>,
    @Inject(SETTINGS_PROVIDER) public settings: Observable<TableSettings>
  ) {}
}
