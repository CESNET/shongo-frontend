import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { RoomRecordingsDataSource } from 'src/app/modules/shongo-table/data-sources/room-recordings.datasource';
import { ExecutableState } from 'src/app/shared/models/enums/executable-state.enum';
import { ReservationRequestState } from 'src/app/shared/models/enums/reservation-request-state.enum';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
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

  readonly settingRecording$ = new BehaviorSubject(false);
  readonly ReservationRequestState = ReservationRequestState;
  readonly ReservationType = ReservationType;
  readonly ExecutableState = ExecutableState;

  constructor(
    private _resReqService: ReservationRequestService,
    private _dialog: MatDialog,
    private _datePipe: MomentDatePipe,
    private _alert: AlertService,
    private _cd: ChangeDetectorRef
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
    this.settingRecording$.next(true);

    this._resReqService
      .setRecording(this.reservationRequest.id, record)
      .pipe(
        first(),
        finalize(() => this.settingRecording$.next(false))
      )
      .subscribe({
        next: () => {
          if (record) {
            this._alert.showSuccess(
              $localize`:success message:Recording started`
            );
            this.reservationRequest.roomCapacityData!.isRecordingActive = true;
          } else {
            this._alert.showSuccess(
              $localize`:success message:Recording stopped`
            );
            this.reservationRequest.roomCapacityData!.isRecordingActive = false;
          }

          this._cd.markForCheck();
        },
        error: (err) => {
          console.error(err);

          if (record) {
            this._alert.showError(
              $localize`:error message:Failed to start recording`
            );
          } else {
            this._alert.showError(
              $localize`:error message:Failed to stop recording`
            );
          }
        },
      });
  }
}
