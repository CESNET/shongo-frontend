import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { RoomService } from 'src/app/core/http/room/room.service';
import { ParticipationInRoomsDataSource } from 'src/app/modules/shongo-table/data-sources/participation-in-rooms.datasource';
import { PhysicalReservationsDataSource } from 'src/app/modules/shongo-table/data-sources/physical-reservations.datasource';
import { YourRoomsDataSource } from 'src/app/modules/shongo-table/data-sources/your-rooms.datasource';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  yourRoomsDataSource: YourRoomsDataSource;
  physicalReservationsDataSource: PhysicalReservationsDataSource;
  participationInRoomsDataSource: ParticipationInRoomsDataSource;

  constructor(
    private _resReqService: ReservationRequestService,
    private _roomService: RoomService,
    private _datePipe: MomentDatePipe,
    private _dialog: MatDialog,
    public auth: AuthenticationService
  ) {
    this.yourRoomsDataSource = new YourRoomsDataSource(
      this._resReqService,
      this._datePipe,
      this._dialog
    );
    this.physicalReservationsDataSource = new PhysicalReservationsDataSource(
      this._resReqService,
      this._datePipe,
      this._dialog
    );
    this.participationInRoomsDataSource = new ParticipationInRoomsDataSource(
      this._roomService,
      this._datePipe
    );
  }
}
