import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { getFormError } from 'src/app/utils/getFormError';
import { ReservationForm } from '../../models/interfaces/reservation-form.interface';
import { ReservationRequestPostBody } from '../../models/types/reservation-request-post-body.type';
import {
  descriptionErrorHandler,
  roomNameErrorHandler,
  pinErrorHandler,
} from '../../utils/custom-error-handlers';
import {
  ROOM_NAME_MAXLENGTH,
  ROOM_NAME_PATTERN,
  ROOM_DESCRIPTION_MAXLENGTH,
  PIN_PATTERN,
  PIN_MINLENGTH,
} from '../../utils/reservation-form.constants';

@Component({
  selector: 'app-teleconference-reservation-form',
  templateUrl: './teleconference-reservation-form.component.html',
  styleUrls: [
    './teleconference-reservation-form.component.scss',
    '../../styles/resource-reservation-form.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeleconferenceReservationFormComponent implements ReservationForm {
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
    timezone: new FormControl(null, [Validators.required]),
    adminPin: new FormControl(null, [
      Validators.required,
      Validators.pattern(PIN_PATTERN),
      Validators.minLength(PIN_MINLENGTH),
    ]),
    userPin: new FormControl(null, [
      Validators.required,
      Validators.pattern(PIN_PATTERN),
      Validators.minLength(PIN_MINLENGTH),
    ]),
  });

  readonly getFormError = getFormError;
  readonly descriptionErrorHandler = descriptionErrorHandler;
  readonly roomNameErrorHandler = roomNameErrorHandler;
  readonly pinErrorHandler = pinErrorHandler;

  constructor(private _settings: SettingsService) {
    this.form.patchValue({ timezone: this._settings.timeZone });
  }

  get valid(): boolean {
    return this.form.valid;
  }

  getFormValue(): ReservationRequestPostBody {
    return this.form.value;
  }
}
