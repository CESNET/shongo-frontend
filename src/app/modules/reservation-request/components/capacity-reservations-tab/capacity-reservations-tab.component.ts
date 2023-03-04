import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { CapacityRequestsDataSource } from 'src/app/modules/shongo-table/data-sources/capacity-requests.datasource';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';

@Component({
  selector: 'app-capacity-reservations-tab',
  templateUrl: './capacity-reservations-tab.component.html',
  styleUrls: ['./capacity-reservations-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapacityReservationsTabComponent implements OnInit {
  capacityRequestsDataSource?: CapacityRequestsDataSource;

  constructor(
    private _route: ActivatedRoute,
    private _resReqService: ReservationRequestService,
    private _datePipe: MomentDatePipe,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._route.params.pipe(first()).subscribe((params) => {
      this.capacityRequestsDataSource = new CapacityRequestsDataSource(
        params.id,
        this._resReqService,
        this._datePipe,
        this._dialog
      );
    });
  }
}
