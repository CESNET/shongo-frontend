import { MomentDatePipe } from '../shared/pipes/moment-date.pipe';

export function datePipeFunc(
  this: { datePipe: MomentDatePipe },
  value: unknown
): string {
  if (!this.datePipe) {
    throw new Error(
      'This needs to have a private parameter datePipe: MomentDatePipe.'
    );
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    value instanceof Date
  ) {
    return (
      this.datePipe.transform(value, 'LLL') ??
      $localize`:fallback text:Not a date`
    );
  } else {
    throw new Error('Invalid column data type for date pipe.');
  }
}
