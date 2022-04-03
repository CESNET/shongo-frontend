import { AbstractControl } from '@angular/forms';
import { formErrors } from '../shared/models/data/form-errors';

const DEFAULT_ERROR_MSG = 'Field is invalid';

export const getFormError = (
  control: AbstractControl,
  customErrorHandler?: (control: AbstractControl) => string | null
): string | null => {
  if (!control.errors) {
    return null;
  }

  const activeErrors = Object.entries(control.errors).filter(
    ([_, value]) => value
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
