import { AbstractControl } from '@angular/forms';

export const roomNameErrorHandler = (
  control: AbstractControl
): string | null => {
  const errors = control.errors!;

  if (errors.pattern) {
    return $localize`:error message:Field can contain only alphanumeric characters, dash or underscore.`;
  } else if (errors.maxlength) {
    return $localize`:error message:Field can have max. ${errors.maxlength.requiredLength} characters.`;
  }
  return null;
};

export const descriptionErrorHandler = (
  control: AbstractControl
): string | null => {
  const errors = control.errors!;

  if (errors.maxlength) {
    return $localize`:error message:Field can have max. ${errors.maxlength.requiredLength} characters.`;
  }
  return null;
};

export const pinErrorHandler = (control: AbstractControl): string | null => {
  const errors = control.errors!;

  if (errors.pattern) {
    return $localize`:error message:Field can contain only numbers.`;
  } else if (errors.minlength) {
    return $localize`:error message:PIN must consist of min. ${errors.minlength.requiredLength} digits.`;
  }
  return null;
};
