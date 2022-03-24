import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getFormError } from 'src/app/utils/getFormError';
import { ReservationForm } from '../../models/reservation-form.interface';

@Component({
  selector: 'app-virtual-room-reservation-form',
  templateUrl: './virtual-room-reservation-form.component.html',
  styleUrls: ['./virtual-room-reservation-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualRoomReservationFormComponent
  implements OnInit, ReservationForm
{
  form = new FormGroup({
    roomName: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    adminPin: new FormControl(null, [Validators.required]),
    allowGuests: new FormControl(false),
  });
  getFormError = getFormError;

  constructor() {}

  ngOnInit(): void {}

  getFormValue() {
    throw new Error('Method not implemented.');
  }
}
