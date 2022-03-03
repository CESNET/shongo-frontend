import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { CapacityRequestsDataSource } from 'src/app/shared/components/data-table/data-sources/capacity-requests.datasource';

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
    private _datePipe: DatePipe,
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
