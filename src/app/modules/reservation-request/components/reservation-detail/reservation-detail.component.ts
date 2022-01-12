import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ReservationRequest } from 'src/app/shared/models/rest-api/reservation-request.interface';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationDetailComponent {
  @Input() reservationRequest!: ReservationRequest;

  constructor() {}
}
