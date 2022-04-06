import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReservationType } from '../../models/enums/reservation-type.enum';
import { ReservationRequest } from '../../models/rest-api/reservation-request.interface';
import { virtualRoomResourceConfig } from 'src/config/virtual-room-resource.config';
import { Technology } from '../../models/enums/technology.enum';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { finalize, first } from 'rxjs/operators';
import { AlertService } from 'src/app/core/services/alert.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-request-confirmation-dialog',
  templateUrl: './request-confirmation-dialog.component.html',
  styleUrls: ['./request-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestConfirmationDialogComponent {
  readonly loading$ = new BehaviorSubject(false);

  ReservationType = ReservationType;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { reservationRequest: ReservationRequest },
    private _resReqService: ReservationRequestService,
    private _dialogRef: MatDialogRef<RequestConfirmationDialogComponent>,
    private _alert: AlertService
  ) {}

  get reservationRequest(): ReservationRequest {
    return this.data.reservationRequest;
  }

  getTechnologyTitle(technology?: Technology): string {
    if (!technology) {
      return $localize`Unknown`;
    }
    return (
      virtualRoomResourceConfig.technologyNameMap.get(technology) ?? technology
    );
  }

  accept(): void {
    this.loading$.next(true);

    this._resReqService
      .acceptRequest(this.reservationRequest.id)
      .pipe(
        first(),
        finalize(() => this.loading$.next(false))
      )
      .subscribe({
        next: () => {
          this._alert.showSuccess($localize`Reservation request accepted.`);
          this._dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          this._alert.showError(
            $localize`Failed to accept reservation request.`
          );
        },
      });
  }

  reject(): void {
    this.loading$.next(true);

    this._resReqService
      .rejectRequest(this.reservationRequest.id)
      .pipe(
        first(),
        finalize(() => this.loading$.next(false))
      )
      .subscribe({
        next: () => {
          this._alert.showSuccess($localize`Reservation request rejected.`);
          this._dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          this._alert.showError(
            $localize`Failed to reject reservation request.`
          );
        },
      });
  }
}
