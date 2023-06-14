import { Pipe, PipeTransform } from '@angular/core';

const MAX_INITIALS_COUNT = 2;
const SPECIAL_CHARSACTERS_PATTERN = /[^a-zA-Z0-9_\s]/g;
const TRAILING_WHITESPACE_PATTERN = /\s+/g;

@Pipe({
  name: 'initials',
})
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    if (!name) {
      return '';
    }

    const cleanedValue = name
      .replace(SPECIAL_CHARSACTERS_PATTERN, '')
      .replace(TRAILING_WHITESPACE_PATTERN, ' ');

    const initials = cleanedValue
      .split(' ')
      .reduce(
        (acc, cur) => (acc.length < MAX_INITIALS_COUNT ? acc + cur[0] : acc),
        ''
      );

    return initials.toUpperCase();
  }
}
