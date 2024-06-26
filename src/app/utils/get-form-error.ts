import { AbstractControl } from '@angular/forms';
import { formErrors } from '../shared/models/data/form-errors';

const DEFAULT_ERROR_MSG = $localize`:error message:Field is invalid`;

export const getFormError = (
  control: AbstractControl,
  customErrorHandler?: (control: AbstractControl) => string | null
): string | null => {
  if (!control.errors) {
    return null;
  }

  const activeErrors = Object.entries(control.errors).filter(
    (entry) => entry[1]
  );

  if (!activeErrors) {
    return null;
  } else {
    const firstError = formErrors[activeErrors[0][0]];
    const customHandlerError = customErrorHandler
      ? customErrorHandler(control)
      : null;

    if (customHandlerError) {
      return customHandlerError;
    } else {
      return firstError ? firstError : DEFAULT_ERROR_MSG;
    }
  }
};
