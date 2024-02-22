import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ALIASES } from '@app/shared/models/constants/url-aliases.const';
import { Alias } from '@app/shared/models/rest-api/alias.interface';
import { Tag } from '@app/shared/models/rest-api/tag.interface';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { finalize, first, takeUntil } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { CertainityCheckComponent } from 'src/app/shared/components/certainity-check/certainity-check.component';
import { AlertType } from 'src/app/shared/models/enums/alert-type.enum';
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
export class ReservationRequestDetailPageComponent
  implements OnInit, OnDestroy
{
  reservationRequest?: ReservationRequestDetail;
  tags?: Tag[];

  readonly loading$ = new BehaviorSubject(true);
  readonly deleting$ = new BehaviorSubject(false);

  readonly ReservationType = ReservationType;
  readonly AllocationState = AllocationState;
  readonly RoomState = RoomState;
  readonly AlertType = AlertType;
  readonly ReservationRequestState = ReservationRequestState;

  tabIndex = 0;
  urlAlias?: Alias;

  private readonly _destroy$ = new Subject<void>();

  constructor(
    private _resReqService: ReservationRequestService,
    private _route: ActivatedRoute,
    private _alert: AlertService,
    private _router: Router,
    private _dialog: MatDialog
  ) {
    this._observeRouteRequestId();
  }

  ngOnInit(): void {
    // Try reading tab index from query string and set it in mat tab group.
    this._route.queryParamMap
      .pipe(takeUntil(this._destroy$))
      .subscribe((params) => {
        const tabIndex = params.get('tabIndex');

        if (tabIndex) {
          const tabIndexNum = Number(tabIndex);

          if (!Number.isNaN(tabIndexNum)) {
            this.tabIndex = tabIndexNum;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Sets tab index into the route's query string.
   *
   * @param index Index of selected tab.
   */
  onTabIndexChange(index: number): void {
    this._router.navigate([], { queryParams: { tabIndex: String(index) } });
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
      return true;
    }

    if (this.reservationRequest?.type === ReservationType.ROOM_CAPACITY) {
      if (
        this.reservationRequest.state ===
        ReservationRequestState.ALLOCATED_FINISHED
      ) {
        return !this.reservationRequest.roomCapacityData?.hasRoomRecordings;
      }
      return !this.reservationRequest.roomCapacityData?.hasRoomRecordingService;
    } else {
      return !this.reservationRequest?.virtualRoomData?.hasRoomRecordings;
    }
  }

  /**
   * Indicates whether runtime management tab should be disabled.
   *
   * @returns  True if should be disabled, else false.
   */
  isRuntimeManagementDisabled(): boolean {
    return (
      this.reservationRequest?.allocationState !== AllocationState.ALLOCATED ||
      this.reservationRequest?.virtualRoomData?.technology === 'FREEPBX' ||
      (this.reservationRequest?.virtualRoomData?.state !== RoomState.STARTED &&
        this.reservationRequest?.virtualRoomData?.state !==
          RoomState.STARTED_AVAILABLE)
    );
  }

  /**
   * Checks user intention and deletes reservation request.
   */
  delete(): void {
    const dialogRef = this._dialog.open(CertainityCheckComponent);

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((shouldDelete) => shouldDelete && this._delete());
  }

  /**
   * Observes reservation request ID from route and fetches given request on change.
   */
  private _observeRouteRequestId(): void {
    this._route.params
      .pipe(takeUntil(this._destroy$))
      .subscribe((params) => this._fetchReservationRequest(params.id));
  }

  /**
   * Fetches reservation request by ID.
   *
   * @param id Reservation request ID.
   */
  private _fetchReservationRequest(id: string): void {
    this.loading$.next(true);

    forkJoin({
      reservationRequest:
        this._resReqService.fetchItem<ReservationRequestDetail>(id),
      tags: this._resReqService.fetchTags(id, true),
    })
      .pipe(
        first(),
        finalize(() => this.loading$.next(false))
      )
      .subscribe(({ reservationRequest, tags }) => {
        this.reservationRequest = reservationRequest;
        this.tags = tags;
        this.urlAlias = this._getUrlAlias();
      });
  }

  /**
   * Deletes current reservation request.
   */
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
          this._alert.showSuccess($localize`:success message:Item deleted`);
          this._router.navigateByUrl('/');
        },
        error: (err) => {
          console.error(err);

          if (
            err instanceof HttpErrorResponse &&
            err.status === 403 &&
            this.reservationRequest?.type === ReservationType.VIRTUAL_ROOM
          ) {
            this._alert.showError(
              $localize`:error message:Can't delete a virtual room with reserved capacity`
            );
          } else {
            this._alert.showError(
              $localize`:error message:Failed to delete item`
            );
          }
        },
      });
  }

  private _getUrlAlias(): Alias | undefined {
    return this.reservationRequest?.authorizedData?.aliases.find((alias) =>
      URL_ALIASES.includes(alias.type)
    );
  }
}
