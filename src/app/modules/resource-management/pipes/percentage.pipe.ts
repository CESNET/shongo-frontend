import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage',
})
export class PercentagePipe implements PipeTransform {
  transform(value: unknown): string {
    let numericalValue: number;

    if (typeof value === 'string') {
      numericalValue = Number(value);
    } else if (typeof value === 'number') {
      numericalValue = value;
    } else {
      throw new Error(
        'Invalid value for percentage pipe. Value has to be string.'
      );
    }

    if (numericalValue < 0 || numericalValue > 1) {
      throw new Error('Value has to be a number between 0 and 1.');
    }

    return `${Math.round(Number(value) * 100)}%`;
  }
}
