import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

type DateFormat =
  | 'LT'
  | 'LTS'
  | 'L'
  | 'l'
  | 'LL'
  | 'll'
  | 'LLL'
  | 'lll'
  | 'LLLL'
  | 'llll';

@Pipe({
  name: 'momentDate',
})
export class MomentDatePipe implements PipeTransform {
  transform(date: string | number | Date, format?: DateFormat): string {
    return moment(date).format(format ?? 'LL');
  }
}
