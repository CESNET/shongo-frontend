import { AbstractControl } from '@angular/forms';
import { formErrors } from '../shared/models/data/form-errors';

const DEFAULT_ERROR_MSG = 'Field is invalid';

export const getFormError = (control: AbstractControl): string | null => {
  if (!control.errors) {
    return null;
  }

  const errors = Object.entries(control.errors).filter(([_, value]) => value);

  return formErrors[errors[0][0]] ?? DEFAULT_ERROR_MSG;
};
