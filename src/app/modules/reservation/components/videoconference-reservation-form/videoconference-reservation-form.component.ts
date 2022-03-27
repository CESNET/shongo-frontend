import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { getFormError } from 'src/app/utils/getFormError';
import { ReservationForm } from '../../models/interfaces/reservation-form.interface';
import { VideoconferenceReservationRequest } from '../../models/interfaces/videoconference-reservation-request.interface';
import {
  descriptionErrorHandler,
  pinErrorHandler,
  roomNameErrorHandler,
} from '../../utils/custom-error-handlers';
import {
  PIN_MINLENGTH,
  PIN_PATTERN,
  ROOM_DESCRIPTION_MAXLENGTH,
  ROOM_NAME_MAXLENGTH,
  ROOM_NAME_PATTERN,
} from '../../utils/reservation-form.constants';
import { PeriodicitySelectionFormComponent } from '../periodicity-selection-form/periodicity-selection-form.component';

@Component({
  selector: 'app-videoconference-reservation-form',
  templateUrl: './videoconference-reservation-form.component.html',
  styleUrls: [
    './videoconference-reservation-form.component.scss',
    '../../styles/resource-reservation-form.scss',
  ],
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
      Validators.maxLength(ROOM_NAME_MAXLENGTH),
      Validators.pattern(ROOM_NAME_PATTERN),
    ]),
    description: new FormControl(null, [
      Validators.required,
      Validators.maxLength(ROOM_DESCRIPTION_MAXLENGTH),
    ]),
    adminPin: new FormControl(null, [
      Validators.required,
      Validators.pattern(PIN_PATTERN),
      Validators.minLength(PIN_MINLENGTH),
    ]),
    participantCount: new FormControl(null, [Validators.required]),
    timezone: new FormControl(null, [Validators.required]),
    allowGuests: new FormControl(false),
    record: new FormControl(false),
  });

  readonly getFormError = getFormError;
  readonly descriptionErrorHandler = descriptionErrorHandler;
  readonly roomNameErrorHandler = roomNameErrorHandler;
  readonly pinErrorHandler = pinErrorHandler;

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
}
