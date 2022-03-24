import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ReservationForm } from '../../models/reservation-form.interface';

@Component({
  selector: 'app-physical-resource-reservation-form',
  templateUrl: './physical-resource-reservation-form.component.html',
  styleUrls: ['./physical-resource-reservation-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhysicalResourceReservationFormComponent
  implements OnInit, ReservationForm
{
  constructor() {}

  ngOnInit(): void {}

  getFormValue() {
    throw new Error('Method not implemented.');
  }
}
