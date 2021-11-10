import { DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ReservationRequestDataSource } from 'src/app/shared/components/data-table/data-source/reservation-request-datasource';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  resReqDataSource: ReservationRequestDataSource;

  constructor(
    private _resReqService: ReservationRequestService,
    private _datePipe: DatePipe
  ) {
    this.resReqDataSource = new ReservationRequestDataSource(
      this._resReqService,
      this._datePipe
    );
  }
}
