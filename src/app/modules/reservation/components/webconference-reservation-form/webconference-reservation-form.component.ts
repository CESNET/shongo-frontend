import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { WebconferenceAccessMode } from 'src/app/shared/models/enums/webconference-access-mode.enum';
import { Option } from 'src/app/shared/models/interfaces/option.interface';
import { getFormError } from 'src/app/utils/getFormError';
import { ReservationForm } from '../../models/interfaces/reservation-form.interface';
import { ReservationRequestPostBody } from '../../models/types/reservation-request-post-body.type';
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
  selector: 'app-webconference-reservation-form',
  templateUrl: './webconference-reservation-form.component.html',
  styleUrls: [
    './webconference-reservation-form.component.scss',
    '../../styles/resource-reservation-form.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebconferenceReservationFormComponent implements ReservationForm {
  @ViewChild(PeriodicitySelectionFormComponent)
  periodicityForm!: PeriodicitySelectionFormComponent;

  readonly form = new FormGroup({
    roomName: new FormControl(null, [
      Validators.required,
      Validators.maxLength(ROOM_NAME_MAXLENGTH),
      Validators.pattern(ROOM_NAME_PATTERN),
    ]),
    description: new FormControl(null, [
      Validators.required,
      Validators.maxLength(ROOM_DESCRIPTION_MAXLENGTH),
    ]),
    userPin: new FormControl(null, [
      Validators.required,
      Validators.pattern(PIN_PATTERN),
      Validators.minLength(PIN_MINLENGTH),
    ]),
    participantCount: new FormControl(null, [Validators.required]),
    timezone: new FormControl(null, [Validators.required]),
    accessMode: new FormControl(WebconferenceAccessMode.CONTROLLED, [
      Validators.required,
    ]),
  });

  readonly accessModeOpts: Option[] = [
    { value: WebconferenceAccessMode.CONTROLLED, displayName: 'Controlled' },
    { value: WebconferenceAccessMode.PUBLIC, displayName: 'Public' },
    { value: WebconferenceAccessMode.PRIVATE, displayName: 'Private' },
  ];

  readonly descriptionErrorHandler = descriptionErrorHandler;
  readonly roomNameErrorHandler = roomNameErrorHandler;
  readonly pinErrorHandler = pinErrorHandler;
  readonly getFormError = getFormError;

  constructor(private _settings: SettingsService) {
    this.form.patchValue({ timezone: this._settings.timeZone });
  }

  get valid(): boolean {
    return (
      this.periodicityForm && this.periodicityForm.valid && this.form.valid
    );
  }

  getFormValue(): ReservationRequestPostBody {
    const periodicity = this.periodicityForm.getPeriodicity();
    return { periodicity, ...this.form.value };
  }
}
