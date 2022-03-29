import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { WebconferenceAccessMode } from 'src/app/shared/models/enums/webconference-access-mode.enum';
import { Option } from 'src/app/shared/models/interfaces/option.interface';
import { getFormError } from 'src/app/utils/getFormError';
import { VirtualRoomReservationForm } from '../../models/interfaces/virtual-room-reservation-form.interface';
import { WebconferenceReservationRequest } from '../../models/interfaces/webconference-reservation-request.interface';
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

type WebconferenceReservationFormValue = Omit<
  WebconferenceReservationRequest,
  'periodicity'
>;

@Component({
  selector: 'app-webconference-reservation-form',
  templateUrl: './webconference-reservation-form.component.html',
  styleUrls: [
    './webconference-reservation-form.component.scss',
    '../../styles/resource-reservation-form.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebconferenceReservationFormComponent
  implements VirtualRoomReservationForm, OnInit
{
  @ViewChild(PeriodicitySelectionFormComponent)
  periodicityForm!: PeriodicitySelectionFormComponent;

  @Input() capacityBookingMode = false;

  readonly form = new FormGroup({
    description: new FormControl(null, [
      Validators.required,
      Validators.maxLength(ROOM_DESCRIPTION_MAXLENGTH),
    ]),
    userPin: new FormControl(null, [
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

  ngOnInit(): void {
    if (!this.capacityBookingMode) {
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

  getFormValue(): WebconferenceReservationRequest {
    const periodicity = this.periodicityForm.getPeriodicity()!;
    const formValue: WebconferenceReservationFormValue = this.form.value;

    if (formValue.userPin == null) {
      delete formValue.userPin;
    }

    return { periodicity, ...formValue };
  }
}
