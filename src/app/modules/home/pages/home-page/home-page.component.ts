import { DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MeetingRoomService } from 'src/app/core/http/meeting-room/meeting-room.service';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { RoomService } from 'src/app/core/http/room/room.service';
import { MeetingRoomDataSource } from 'src/app/shared/components/data-table/data-source/meeting-room.datasource';
import { ReservationRequestDataSource } from 'src/app/shared/components/data-table/data-source/reservation-request-datasource';
import { RoomDataSource } from 'src/app/shared/components/data-table/data-source/room-datasource';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  resReqDataSource: ReservationRequestDataSource;
  roomDataSource: RoomDataSource;
  meetingRoomDataSource: MeetingRoomDataSource;

  constructor(
    private _resReqService: ReservationRequestService,
    private _roomService: RoomService,
    private _meetingRoomService: MeetingRoomService,
    private _datePipe: DatePipe
  ) {
    this.resReqDataSource = new ReservationRequestDataSource(
      this._resReqService,
      this._datePipe
    );
    this.roomDataSource = new RoomDataSource(this._roomService, this._datePipe);
    this.meetingRoomDataSource = new MeetingRoomDataSource(
      this._meetingRoomService,
      this._datePipe
    );
  }
}
