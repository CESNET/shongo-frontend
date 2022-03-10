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

  areRecordingsDisabled(): boolean {
    if (this.reservationRequest?.type === ReservationType.ROOM_CAPACITY) {
      return (
        this.reservationRequest.allocationState !== AllocationState.ALLOCATED ||
        !this.reservationRequest.roomCapacityData?.capacityHasRecordingService
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
