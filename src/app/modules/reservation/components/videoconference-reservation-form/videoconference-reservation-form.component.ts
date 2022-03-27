import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { getFormError } from 'src/app/utils/getFormError';
import { ReservationForm } from '../../models/reservation-form.interface';
import { PeriodicitySelectionFormComponent } from '../periodicity-selection-form/periodicity-selection-form.component';

export interface VideoconferenceReservationRequest {
  roomName: string;
  description: string;
  adminPin: string;
  participantCount: number;
  timezone: string;
  allowGuests: boolean;
  record: boolean;
}

@Component({
  selector: 'app-videoconference-reservation-form',
  templateUrl: './videoconference-reservation-form.component.html',
  styleUrls: ['./videoconference-reservation-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoconferenceReservationFormComponent
  implements ReservationForm
{
  @ViewChild(PeriodicitySelectionFormComponent)
  periodicityForm!: PeriodicitySelectionFormComponent;

  form = new FormGroup({
    roomName: new FormControl(null, [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/^[a-z0-9\-\_]+$/i),
    ]),
    description: new FormControl(null, [
      Validators.required,
      Validators.maxLength(200),
    ]),
    adminPin: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
      Validators.minLength(4),
    ]),
    participantCount: new FormControl(null, [Validators.required]),
    timezone: new FormControl(null, [Validators.required]),
    allowGuests: new FormControl(false),
    record: new FormControl(false),
  });

  readonly getFormError = getFormError;

  constructor(private _settings: SettingsService) {
    this.form.patchValue({ timezone: this._settings.timeZone });
  }

  get valid(): boolean {
    return (
      this.periodicityForm && this.periodicityForm.valid && this.form.valid
    );
  }

  getFormValue(): VideoconferenceReservationRequest {
    const periodicity = this.periodicityForm.getPeriodicity();
    return { periodicity, ...this.form.value };
  }

  roomNameErrorHandler = (control: AbstractControl): string | null => {
    const errors = control.errors!;

    if (errors.pattern) {
      return 'Field can contain only alphanumeric characters, dash or underscore.';
    } else if (errors.maxlength) {
      return `Field can have max. ${errors.maxlength.requiredLength} characters.`;
    }
    return null;
  };

  descriptionErrorHandler = (control: AbstractControl): string | null => {
    const errors = control.errors!;

    if (errors.maxlength) {
      return `Field can have max. ${errors.maxlength.requiredLength} characters.`;
    }
    return null;
  };

  adminPinErrorHandler = (control: AbstractControl): string | null => {
    const errors = control.errors!;

    if (errors.pattern) {
      return `Field can contain only numbers.`;
    } else if (errors.minlength) {
      return `PIN must consist of min. ${errors.minlength.requiredLength} digits.`;
    }
    return null;
  };
}
