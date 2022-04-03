import { AbstractControl } from '@angular/forms';

export const minLengthErrorHandler = (
  control: AbstractControl
): string | null => {
  const errors = control.errors!;

  if (errors.minlength) {
    return `Field must contain at least ${errors.minlength.requiredLength} characters.`;
  }
  return null;
};

export const emailErrorHandler = (control: AbstractControl): string | null => {
  const errors = control.errors!;

  if (errors.email) {
    return `Value must be an e-mail.`;
  }
  return null;
};
