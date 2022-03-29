import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { TeleconferenceReservationRequest } from 'src/app/modules/reservation/models/interfaces/teleconference-reservation-request.interface';
import { getFormError } from 'src/app/utils/getFormError';
import { VirtualRoomReservationForm } from '../../interfaces/virtual-room-reservation-form.interface';
import {
  descriptionErrorHandler,
  roomNameErrorHandler,
  pinErrorHandler,
} from '../../utils/custom-error-handlers';
import {
  ROOM_DESCRIPTION_MAXLENGTH,
  PIN_PATTERN,
  PIN_MINLENGTH,
  ROOM_NAME_MAXLENGTH,
  ROOM_NAME_PATTERN,
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
export class TeleconferenceReservationFormComponent
  implements VirtualRoomReservationForm, OnInit
{
  @Input() editingMode = false;

  form = new FormGroup({
    description: new FormControl(null, [
      Validators.required,
      Validators.maxLength(ROOM_DESCRIPTION_MAXLENGTH),
    ]),
    timezone: new FormControl(null, [Validators.required]),
    adminPin: new FormControl(null, [
      Validators.pattern(PIN_PATTERN),
      Validators.minLength(PIN_MINLENGTH),
    ]),
    userPin: new FormControl(null, [
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

  ngOnInit(): void {
    if (!this.editingMode) {
      this.form.addControl(
        'roomName',
        new FormControl(null, [
          Validators.required,
          Validators.maxLength(ROOM_NAME_MAXLENGTH),
          Validators.pattern(ROOM_NAME_PATTERN),
        ])
      );
    }
  }

  getFormValue(): TeleconferenceReservationRequest {
    const formValue: TeleconferenceReservationRequest = this.form.value;

    if (formValue.adminPin == null) {
      delete formValue.adminPin;
    }
    if (formValue.userPin == null) {
      delete formValue.userPin;
    }

    return formValue;
  }
}
