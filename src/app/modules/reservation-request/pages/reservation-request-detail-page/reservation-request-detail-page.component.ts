import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  Input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import {
  catchError,
  finalize,
  first,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { CertainityCheckComponent } from 'src/app/shared/components/certainity-check/certainity-check.component';
import { AllocationState } from 'src/app/shared/models/enums/allocation-state.enum';
import { ReservationRequestState } from 'src/app/shared/models/enums/reservation-request-state.enum';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
import { RoomState } from 'src/app/shared/models/enums/room-state.enum';
import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';

@Component({
  selector: 'app-reservation-request-detail-page',
  templateUrl: './reservation-request-detail-page.component.html',
  styleUrls: ['./reservation-request-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationRequestDetailPageComponent implements OnDestroy {
  @ViewChild(MatTabGroup) tabGroup?: MatTabGroup;
  @Input() reservationRequest?: ReservationRequestDetail;

  readonly loading$ = new BehaviorSubject(true);
  readonly deleting$ = new BehaviorSubject(false);
  readonly ReservationType = ReservationType;
  readonly AllocationState = AllocationState;
  readonly RoomState = RoomState;
  readonly ReservationRequestState = ReservationRequestState;

  private readonly _destroy$ = new Subject<void>();

  constructor(
    private _resReqService: ReservationRequestService,
    private _route: ActivatedRoute,
    private _alert: AlertService,
    private _router: Router,
    private _dialog: MatDialog
  ) {
    this._route.params
      .pipe(
        tap(() => this.loading$.next(true)),
        switchMap((params) =>
          this._resReqService.fetchItem<ReservationRequestDetail>(params.id)
        ),
        tap(() => {
          this.loading$.next(false);

          if (this.tabGroup) {
            this.tabGroup.selectedIndex = 0;
          }
        }),
        catchError((err) => {
          this.loading$.next(false);
          return throwError(err);
        }),
        takeUntil(this._destroy$)
      )
      .subscribe((req) => (this.reservationRequest = req));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Recordings tab should be disabled if:
   *
   * Virtual room:
   * 1. Room is not yet allocated.
   * 2. Room has no recordings.
   *
   * Room capacity:
   * 1. Has no recording service.
   * 2. Has stopped and there are no recordings.
   *
   * @returns True if recordings tab should be disabled.
   */
  areRecordingsDisabled(): boolean {
    if (
      this.reservationRequest?.allocationState !== AllocationState.ALLOCATED
    ) {
      return false;
    }
    if (this.reservationRequest?.type === ReservationType.ROOM_CAPACITY) {
      return (
        !this.reservationRequest.roomCapacityData
          ?.capacityHasRecordingService ||
        (this.reservationRequest.state ===
          ReservationRequestState.ALLOCATED_FINISHED &&
          !this.reservationRequest.roomCapacityData.capacityHasRecordings)
      );
    } else {
      return !this.reservationRequest?.virtualRoomData?.roomHasRecordings;
    }
  }

  isRuntimeManagementDisabled(): boolean {
    return (
      this.reservationRequest?.allocationState !== AllocationState.ALLOCATED ||
      this.reservationRequest?.virtualRoomData?.technology === 'FREEPBX' ||
      (this.reservationRequest?.virtualRoomData?.state !== RoomState.STARTED &&
        this.reservationRequest?.virtualRoomData?.state !==
          RoomState.STARTED_AVAILABLE)
    );
  }

  delete(): void {
    const dialogRef = this._dialog.open(CertainityCheckComponent);

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((shouldDelete) => shouldDelete && this._delete());
  }

  private _delete(): void {
    this.deleting$.next(true);

    this._resReqService
      .deleteItem(this.reservationRequest!.id)
      .pipe(
        first(),
        finalize(() => this.deleting$.next(false))
      )
      .subscribe({
        next: () => {
          this._alert.showSuccess($localize`Item deleted`);
          this._router.navigateByUrl('/');
        },
        error: (err) => {
          console.error(err);
          this._alert.showError($localize`Failed to delete item`);
        },
      });
  }
}
