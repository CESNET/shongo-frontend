import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { finalize, first, takeUntil } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { virtualRoomResourceConfig } from 'src/config/virtual-room-resource.config';
import { ReservationType } from '../../models/enums/reservation-type.enum';
import { Technology } from '../../models/enums/technology.enum';
import { ReservationRequest } from '../../models/rest-api/reservation-request.interface';

@Component({
  selector: 'app-request-confirmation-dialog',
  templateUrl: './request-confirmation-dialog.component.html',
  styleUrls: ['./request-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestConfirmationDialogComponent implements OnInit, OnDestroy {
  readonly loading$ = new BehaviorSubject(false);
  readonly ReservationType = ReservationType;

  private readonly _destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { reservationRequest: ReservationRequest },
    private _resReqService: ReservationRequestService,
    private _dialogRef: MatDialogRef<RequestConfirmationDialogComponent>,
    private _alert: AlertService,
    private _router: Router
  ) {}

  get reservationRequest(): ReservationRequest {
    return this.data.reservationRequest;
  }

  ngOnInit(): void {
    this._observeRouterEvents();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Returns title for technology from virtual room resource configuration.
   *
   * @param technology Virtual room technology.
   * @returns Technology title.
   */
  getTechnologyTitle(technology?: Technology): string {
    if (!technology) {
      return $localize`:fallback text:Unknown`;
    }
    return (
      virtualRoomResourceConfig.technologyNameMap.get(technology) ?? technology
    );
  }

  /**
   * Accepts reservation request.
   */
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
          this._alert.showSuccess(
            $localize`:success message:Reservation request accepted.`
          );
          this._dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          this._alert.showError(
            $localize`:error message:Failed to accept reservation request.`
          );
        },
      });
  }

  /**
   * Rejects reservation request.
   */
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
          this._alert.showSuccess(
            $localize`:success message:Reservation request rejected.`
          );
          this._dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          this._alert.showError(
            $localize`:error message:Failed to reject reservation request.`
          );
        },
      });
  }

  /**
   * Observes routing events and on any event closes the dialog.
   * Otherwise dialog would stay open after navigating to another route.
   */
  private _observeRouterEvents(): void {
    this._router.events
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this._dialogRef.close());
  }
}
