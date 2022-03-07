import { DatePipe } from '@angular/common';

export function datePipeFunc(
  this: { datePipe: DatePipe },
  value: unknown
): string {
  if (!this.datePipe) {
    throw new Error(
      'This needs to have a private parameter datePipe: DatePipe.'
    );
  }

  if (typeof value === 'string') {
    return this.datePipe.transform(value, 'medium') ?? 'Not a date';
  } else {
    throw new Error('Invalid column data type for date pipe.');
  }
}
