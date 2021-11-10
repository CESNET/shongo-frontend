import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appShortString',
})
export class ShortStringPipe implements PipeTransform {
  transform(value: unknown, length: number): string | null {
    if (!value) {
      return null;
    }

    let stringValue: string;

    if (typeof value === 'number') {
      stringValue = value.toString();
    } else if (typeof value === 'string') {
      stringValue = value;
    } else {
      return null;
    }

    if (stringValue.length <= length) {
      return stringValue;
    }
    const substring = stringValue.substring(0, length);
    return substring + '...';
  }
}
