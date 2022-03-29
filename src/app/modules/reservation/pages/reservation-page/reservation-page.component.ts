import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CalendarView } from 'angular-calendar';
import { BehaviorSubject } from 'rxjs';
import { finalize, first, tap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ReservationCalendarComponent } from 'src/app/shared/components/reservation-calendar/reservation-calendar.component';
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
export class ReservationPageComponent implements OnInit {
  @ViewChild(ReservationCalendarComponent)
  calendar!: ReservationCalendarComponent;

  CalendarView = CalendarView;
  selectedResource?: Resource | null;
  selectedSlot?: CalendarSlot | null;
  parentReservationRequest?: ReservationRequestDetail;
  parentRequestError?: Error;
  capacityBookingMode = false;

  AlertType = AlertType;

  readonly loadingParentRequest$ = new BehaviorSubject<boolean>(false);

  constructor(
    private _dialog: MatDialog,
    private _route: ActivatedRoute,
    private _resReqService: ReservationRequestService,
    private _resourceService: ResourceService,
    public resourceService: ResourceService
  ) {}

  ngOnInit(): void {
    this._checkRouteForId();
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
              $localize`Parent reservation request must be of type virtual room.`
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
              $localize`No resource found using room's technology (${resReq.virtualRoomData.technology}).`
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
