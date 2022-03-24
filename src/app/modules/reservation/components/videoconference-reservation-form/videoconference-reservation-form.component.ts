import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getFormError } from 'src/app/utils/getFormError';
import { ReservationForm } from '../../models/reservation-form.interface';

@Component({
  selector: 'app-videoconference-reservation-form',
  templateUrl: './videoconference-reservation-form.component.html',
  styleUrls: ['./videoconference-reservation-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoconferenceReservationFormComponent
  implements ReservationForm
{
  form = new FormGroup({
    roomName: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    adminPin: new FormControl(null, [Validators.required]),
    participantCount: new FormControl(null, [Validators.required]),
    timezone: new FormControl(null, [Validators.required]),
    allowGuests: new FormControl(false),
    record: new FormControl(false),
  });

  readonly getFormError = getFormError;

  constructor() {}

  getFormValue() {
    throw new Error('Method not implemented.');
  }
}
