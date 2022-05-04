import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CalendarView } from 'angular-calendar';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize, first, takeUntil, tap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ReservationCalendarComponent } from 'src/app/modules/shongo-calendar/components/reservation-calendar/reservation-calendar.component';
import { AlertType } from 'src/app/shared/models/enums/alert-type.enum';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { Resource } from 'src/app/shared/models/rest-api/resource.interface';
import { CalendarSlot } from 'src/app/shared/models/rest-api/slot.interface';
import { ReservationDialogComponent } from '../../components/reservation-dialog/reservation-dialog.component';

class ParentRequestPropertyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRequestTypeError';
  }
}

@Component({
  selector: 'app-reservation-page',
  templateUrl: './reservation-page.component.html',
  styleUrls: ['./reservation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationPageComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(ReservationCalendarComponent)
  calendar!: ReservationCalendarComponent;

  readonly tabletSizeHit$: Observable<BreakpointState>;
  CalendarView = CalendarView;
  selectedResource?: Resource | null;
  selectedSlot?: CalendarSlot | null;
  parentReservationRequest?: ReservationRequestDetail;
  parentRequestError?: Error;
  capacityBookingMode = false;

  AlertType = AlertType;

  readonly loadingParentRequest$ = new BehaviorSubject<boolean>(false);
  private readonly _destroy$ = new Subject<void>();

  constructor(
    private _dialog: MatDialog,
    private _route: ActivatedRoute,
    private _resReqService: ReservationRequestService,
    private _resourceService: ResourceService,
    private _br: BreakpointObserver,
    private _cd: ChangeDetectorRef,
    public resourceService: ResourceService
  ) {
    this.tabletSizeHit$ = this._createTabletSizeObservable();
  }

  ngOnInit(): void {
    this._checkRouteForId();
  }

  ngAfterViewInit(): void {
    this._observeTabletSize(this.tabletSizeHit$);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  openReservationDialog(): void {
    if (!this.selectedResource) {
      return;
    }

    const dialogRef = this._dialog.open(ReservationDialogComponent, {
      data: {
        resource: this.selectedResource,
        slot: this.selectedSlot,
        parentRequest: this.parentReservationRequest,
      },
      width: '95%',
      maxWidth: '120ch',
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result) {
          this.calendar.clearSelectedSlot();
          this.calendar.fetchReservations();
        }
      });
  }

  parentPropertyErrorOccured(): boolean {
    return (
      this.parentRequestError !== undefined &&
      this.parentRequestError instanceof ParentRequestPropertyError
    );
  }

  retryLoadingParentRequest(): void {
    this.parentRequestError = undefined;
    this._loadParentRequest(this.parentReservationRequest!.id);
  }

  onDateSelection(moment: moment.Moment): void {
    this.calendar.viewDate = moment.toDate();
  }

  /**
   * Increments selected slot part by a given increment in minutes.
   *
   * @param part Start or end of slot.
   * @param increment Value of minute increment.
   */
  incrementSlot(part: 'start' | 'end', increment: 1 | -1): void {
    const slot = this.calendar.selectedSlot;

    if (!slot) {
      throw new Error('No slot has been selected yet.');
    }

    const incrementedSlot = Object.assign({}, slot);
    incrementedSlot[part] = moment(incrementedSlot[part])
      .add(increment, 'minutes')
      .toDate();

    this.selectedSlot = incrementedSlot;
    this.calendar.selectedSlot = incrementedSlot;
  }

  private _observeTabletSize(state$: Observable<BreakpointState>): void {
    state$.subscribe((state) => {
      if (state.matches) {
        this.calendar.view = CalendarView.Day;
        this._cd.detectChanges();
      }
    });
  }

  private _createTabletSizeObservable(): Observable<BreakpointState> {
    return this._br
      .observe('(max-width: 768px)')
      .pipe(takeUntil(this._destroy$));
  }

  private _checkRouteForId(): void {
    const requestId = this._route.snapshot.params.id;

    if (requestId) {
      this._initCapacityBookingMode(requestId);
    }
  }

  private _initCapacityBookingMode(requestId: string): void {
    this.capacityBookingMode = true;
    this._loadParentRequest(requestId);
  }

  private _loadParentRequest(requestId: string): void {
    this.loadingParentRequest$.next(true);

    this._resReqService
      .fetchItem<ReservationRequestDetail>(requestId)
      .pipe(
        first(),
        tap((resReq) => {
          if (
            resReq.type !== ReservationType.VIRTUAL_ROOM ||
            !resReq.virtualRoomData?.technology
          ) {
            throw new ParentRequestPropertyError(
              $localize`:error message:Parent reservation request must be of type virtual room.`
            );
          }
          const virtualRoomResource =
            this._resourceService.findResourceByTechnology(
              resReq.virtualRoomData!.technology
            );

          if (virtualRoomResource) {
            this.selectedResource = virtualRoomResource;
          } else {
            throw new ParentRequestPropertyError(
              $localize`:error message:No resource found using room's technology (${resReq.virtualRoomData.technology}).`
            );
          }
        }),
        finalize(() => this.loadingParentRequest$.next(false))
      )
      .subscribe({
        next: (resReq) => {
          this.parentReservationRequest = resReq;
        },
        error: (err) => {
          console.error(err);
          this.parentRequestError = err;
        },
      });
  }
}
