import { Component, Inject, InjectionToken } from '@angular/core';

export const VALUE_PROVIDER = new InjectionToken<string>('column.value');

@Component({
  template: '',
})
export class ColumnComponent {
  value: string;

  constructor(@Inject(VALUE_PROVIDER) value: string) {
    this.value = value;
  }
}
