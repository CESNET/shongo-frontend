import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  Input,
} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { AllocationState } from 'src/app/shared/models/enums/allocation-state.enum';
import { ExecutableState } from 'src/app/shared/models/enums/executable-state.enum';
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

  loading$ = new BehaviorSubject(true);
  ReservationType = ReservationType;
  AllocationState = AllocationState;
  RoomState = RoomState;
  ReservationRequestState = ReservationRequestState;

  private _destroy$ = new Subject<void>();

  constructor(
    private _resReqService: ReservationRequestService,
    private _route: ActivatedRoute
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
}
