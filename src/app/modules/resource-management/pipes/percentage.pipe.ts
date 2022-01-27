import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage',
})
export class PercentagePipe implements PipeTransform {
  transform(value: unknown): string {
    if (typeof value === 'string') {
      const decimal = Number(value);

      if (decimal < 0 || decimal > 1) {
        throw new Error('Value has to be a number between 0 and 1.');
      }

      return `${Math.round(Number(value) * 100)}%`;
    } else {
      throw new Error(
        'Invalid value for percentage pipe. Value has to be string.'
      );
    }
  }
}
