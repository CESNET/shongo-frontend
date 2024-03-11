import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from '@app/core/services/layout.service';
import { CalendarReservationsService } from '@app/modules/calendar-helper/services/calendar-reservations.service';
import { ERequestState } from '@app/shared/models/enums/request-state.enum';
import { IRequest } from '@app/shared/models/interfaces/request.interface';
import {
  ICalendarItem,
  IEventOwner,
  IInterval,
  ShongoCalendarComponent,
} from '@cesnet/shongo-calendar';
import { CalendarView } from 'angular-calendar';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  filter,
  finalize,
  first,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { Resource } from 'src/app/shared/models/rest-api/resource.interface';
import { CalendarSlot } from 'src/app/shared/models/rest-api/slot.interface';
import { ParentRequestPropertyError } from '../../models/errors/parent-request-property.error';

@Component({
  selector: 'app-reservation-page',
  templateUrl: './reservation-page.component.html',
  styleUrls: ['./reservation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationPageComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  /**
   * Calendar component.
   */
  @ViewChild(ShongoCalendarComponent)
  calendar!: ShongoCalendarComponent;

  readonly calendarRequest$: Observable<IRequest<ICalendarItem[]>>;
  readonly CalendarView = CalendarView;
  readonly ERequestState = ERequestState;
  readonly currentUser: IEventOwner;

  displayedResources: Resource[] = [];
  capacityBookingMode = false;

  selectedResource?: Resource | null;
  selectedSlot?: CalendarSlot | null;
  parentReservationRequest?: ReservationRequestDetail;
  parentRequestError?: Error;

  readonly loadingParentRequest$ = new BehaviorSubject<boolean>(false);

  private _currentInterval?: IInterval;

  private readonly _calendarRequest$ = new BehaviorSubject<
    IRequest<ICalendarItem[]>
  >({ data: [], state: ERequestState.SUCCESS });
  private readonly _destroy$ = new Subject<void>();

  constructor(
    private _route: ActivatedRoute,
    private _resReqService: ReservationRequestService,
    private _cd: ChangeDetectorRef,
    private _calendarResS: CalendarReservationsService,
    private _router: Router,
    private _layoutS: LayoutService,
    public resourceService: ResourceService
  ) {
    this.calendarRequest$ = this._calendarRequest$.asObservable();
    this.currentUser = this._calendarResS.currentUser;
  }

  get isTabletSize$(): Observable<boolean> {
    return this._layoutS.isTabletSize$;
  }

  ngOnInit(): void {
    this._checkRouteForId();
  }

  ngAfterViewInit(): void {
    this._observeTabletSize();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Tries loading parent request again after error.
   */
  retryLoadingParentRequest(): void {
    this.parentRequestError = undefined;
    this._loadParentRequest(this.parentReservationRequest!.id);
  }

  onIntervalChange(interval: IInterval): void {
    this._currentInterval = interval;
    this._fetchInterval(interval);
  }

  onSelectedResourceChange(resource: Resource | null): void {
    this.selectedResource = resource;
  }

  onDisplayedResourcesChange(resources: Resource[]): void {
    this.displayedResources = resources;
    this.refetchInterval();
  }

  onItemClick(item: ICalendarItem): void {
    if (item.data?.id) {
      void this._router.navigate(['reservation-request', item.data?.id]);
    }
  }

  onDateSelection(date: Date): void {
    this.calendar.viewDate = date;
  }

  refetchInterval(): void {
    if (this._currentInterval) {
      this._fetchInterval(this._currentInterval);
    }
  }

  /**
   * Fetches reservations for a given interval.
   *
   * @param interval Interval to fetch reservations for.
   */
  private _fetchInterval(interval: IInterval): void {
    let request$: Observable<IRequest<ICalendarItem[]>>;

    if (this.capacityBookingMode) {
      request$ = this.loadingParentRequest$.pipe(
        filter((loading) => !loading),
        first(),
        switchMap(() =>
          this._calendarResS.fetchCapacitiesInterval$(
            this.parentReservationRequest!.id,
            interval
          )
        )
      );
    } else {
      request$ = this._calendarResS.fetchInterval$(
        this.displayedResources!,
        interval
      );
    }

    request$.subscribe((req) => this._calendarRequest$.next(req));
  }

  /**
   * Observes tablet size hit (768px).
   * Switches calendar view to day view for sizes < 768px.
   */
  private _observeTabletSize(): void {
    this.isTabletSize$
      .pipe(takeUntil(this._destroy$))
      .subscribe((isTableSize) => {
        if (isTableSize) {
          this.calendar.view = CalendarView.Day;
          this._cd.detectChanges();
        }
      });
  }

  /**
   * Checks if route contains parent request ID. If yes, initializes capacity booking mode.
   */
  private _checkRouteForId(): void {
    const requestId = this._route.snapshot.params.id;

    if (requestId) {
      this._initCapacityBookingMode(requestId);
    }
  }

  /**
   * Loads parent request and switches to capacity booking mode.
   *
   * @param requestId Parent reservation request ID.
   */
  private _initCapacityBookingMode(requestId: string): void {
    this.capacityBookingMode = true;
    this._loadParentRequest(requestId);
  }

  /**
   * Fetches parent reservation request.
   *
   * @param requestId Parent reservation request ID.
   */
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
            this.resourceService.findResourceByTechnology(
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
