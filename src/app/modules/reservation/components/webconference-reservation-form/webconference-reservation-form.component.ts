import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ReservationForm } from '../../models/reservation-form.interface';

@Component({
  selector: 'app-webconference-reservation-form',
  templateUrl: './webconference-reservation-form.component.html',
  styleUrls: ['./webconference-reservation-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebconferenceReservationFormComponent
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
