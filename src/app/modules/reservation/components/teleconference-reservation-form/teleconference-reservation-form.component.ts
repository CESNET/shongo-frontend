import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ReservationForm } from '../../models/reservation-form.interface';

@Component({
  selector: 'app-teleconference-reservation-form',
  templateUrl: './teleconference-reservation-form.component.html',
  styleUrls: ['./teleconference-reservation-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeleconferenceReservationFormComponent
  implements OnInit, ReservationForm
{
  constructor() {}

  ngOnInit(): void {}

  get valid(): boolean {
    return false;
  }

  getFormValue(): any {
    throw new Error('Method not implemented.');
  }
}
