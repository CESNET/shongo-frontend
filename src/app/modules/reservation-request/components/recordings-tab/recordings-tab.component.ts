import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { RoomRecordingsDataSource } from 'src/app/shared/components/data-table/data-sources/room-recordings.datasource';
import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';

@Component({
  selector: 'app-recordings-tab',
  templateUrl: './recordings-tab.component.html',
  styleUrls: ['./recordings-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordingsTabComponent implements OnInit {
  @Input() reservationRequest!: ReservationRequestDetail;
  roomRecordingDataSource!: RoomRecordingsDataSource;

  constructor(
    private _resReqService: ReservationRequestService,
    private _dialog: MatDialog,
    private _datePipe: MomentDatePipe
  ) {}

  ngOnInit(): void {
    this.roomRecordingDataSource = new RoomRecordingsDataSource(
      this._resReqService,
      this._dialog,
      this._datePipe,
      this.reservationRequest.id
    );
  }

  setRecording(record: boolean): void {
    this._resReqService
      .setRecording(this.reservationRequest.id, record)
      .pipe(first())
      .subscribe();
  }
}
