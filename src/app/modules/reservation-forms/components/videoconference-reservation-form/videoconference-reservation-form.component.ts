import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { VideoconferenceReservationRequest } from 'src/app/shared/models/rest-api/videoconference-reservation-request.interface';
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

type VideoconferenceReservationFormValue = Omit<
  VideoconferenceReservationRequest,
  'periodicity'
>;

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
  implements VirtualRoomReservationForm, OnInit
{
  @ViewChild(PeriodicitySelectionFormComponent)
  periodicityForm!: PeriodicitySelectionFormComponent;

  @Input() editingMode = false;
  @Input() editedRequest?: ReservationRequestDetail | undefined;

  form = new FormGroup({
    description: new FormControl(null, [
      Validators.required,
      Validators.maxLength(ROOM_DESCRIPTION_MAXLENGTH),
    ]),
    adminPin: new FormControl(null, [
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
    }
  }

  fill({
    description,
    authorizedData,
    roomCapacityData,
  }: ReservationRequestDetail): void {
    if (description) {
      this.form.get('description')!.setValue(description);
    }
    if (authorizedData) {
      const { adminPin, allowGuests } = authorizedData;

      if (adminPin) {
        this.form.get('adminPin')!.setValue(adminPin);
      }
      if (allowGuests) {
        this.form.get('allowGuests')!.setValue(allowGuests);
      }
    }
    if (roomCapacityData) {
      const { capacityParticipantCount, capacityHasRecordingService } =
        roomCapacityData;

      if (capacityParticipantCount) {
        this.form.get('participantCount')!.setValue(capacityParticipantCount);
      }
      if (capacityHasRecordingService) {
        this.form.get('record')!.setValue(capacityHasRecordingService);
      }
    }
  }

  getFormValue(): VideoconferenceReservationRequest {
    const periodicity = this.periodicityForm.getPeriodicity()!;
    const formValue: VideoconferenceReservationFormValue = this.form.value;

    if (formValue.adminPin == null) {
      delete formValue.adminPin;
    }

    return { periodicity, ...formValue };
  }
}
