import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { TeleconferenceReservationRequest } from 'src/app/shared/models/rest-api/teleconference-reservation-request.interface';
import { getFormError } from 'src/app/utils/get-form-error';
import { VirtualRoomReservationForm } from '../../interfaces/virtual-room-reservation-form.interface';
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
  @Input() editedRequest?: ReservationRequestDetail | undefined;

  readonly form = new UntypedFormGroup({
    description: new UntypedFormControl(null, [
      Validators.required,
      Validators.maxLength(ROOM_DESCRIPTION_MAXLENGTH),
    ]),
    timezone: new UntypedFormControl(null, [Validators.required]),
    adminPin: new UntypedFormControl(null, [
      Validators.pattern(PIN_PATTERN),
      Validators.minLength(PIN_MINLENGTH),
    ]),
    userPin: new UntypedFormControl(null, [
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

  /**
   * Form vlidity.
   */
  get valid(): boolean {
    return this.form.valid;
  }

  ngOnInit(): void {
    if (!this.editingMode && !this.editedRequest) {
      this.form.addControl(
        'roomName',
        new UntypedFormControl(null, [
          Validators.required,
          Validators.maxLength(ROOM_NAME_MAXLENGTH),
          Validators.pattern(ROOM_NAME_PATTERN),
        ])
      );
    }

    if (this.editedRequest) {
      this.fill(this.editedRequest);
    }
  }

  /**
   * Fills form with reservation request detail.
   *
   * @param param0 Reservation request detail.
   */
  fill({ description, authorizedData }: ReservationRequestDetail): void {
    if (description) {
      this.form.get('description')!.setValue(description);
    }
    if (authorizedData) {
      const { adminPin, userPin } = authorizedData;

      if (adminPin) {
        this.form.get('adminPin')!.setValue(adminPin);
      }
      if (userPin) {
        this.form.get('userPin')!.setValue(userPin);
      }
    }
  }

  /**
   * Returns form value.
   *
   * @returns Form value.
   */
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
