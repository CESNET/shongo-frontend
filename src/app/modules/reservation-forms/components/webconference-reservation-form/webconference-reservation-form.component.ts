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
import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { WebconferenceReservationRequest } from 'src/app/shared/models/rest-api/webconference-reservation-request.interface';
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

  @Input() editingMode = false;
  @Input() editedRequest?: ReservationRequestDetail | undefined;

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
  });

  readonly accessModeOpts: Option[] = [
    {
      value: WebconferenceAccessMode.CONTROLLED,
      displayName: $localize`:option name: Adobe connect access mode:Controlled`,
    },
    {
      value: WebconferenceAccessMode.PUBLIC,
      displayName: $localize`:option name: Adobe connect access mode:Public`,
    },
    {
      value: WebconferenceAccessMode.PRIVATE,
      displayName: $localize`:option name: Adobe connect access mode:Private`,
    },
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
    if (!this.editingMode && !this.editedRequest) {
      this.form.addControl(
        'roomName',
        new FormControl(null, [
          Validators.required,
          Validators.maxLength(ROOM_NAME_MAXLENGTH),
          Validators.pattern(ROOM_NAME_PATTERN),
        ])
      );
    }

    if (this.editedRequest) {
      this.fill(this.editedRequest);
    } else {
      this.form.addControl(
        'accessMode',
        new FormControl(WebconferenceAccessMode.CONTROLLED, [
          Validators.required,
        ])
      );
    }
  }

  fill({
    description,
    roomCapacityData,
    authorizedData,
  }: ReservationRequestDetail): void {
    if (description) {
      this.form.get('description')!.setValue(description);
    }
    if (authorizedData) {
      const { userPin } = authorizedData;

      if (userPin) {
        this.form.get('userPin')!.setValue(userPin);
      }
    }
    if (roomCapacityData) {
      const { capacityParticipantCount } = roomCapacityData;

      if (capacityParticipantCount) {
        this.form.get('participantCount')!.setValue(capacityParticipantCount);
      }
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
