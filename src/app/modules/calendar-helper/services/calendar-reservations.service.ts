import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { ReservationRequestService } from '@app/core/http/reservation-request/reservation-request.service';
import { AlertService } from '@app/core/services/alert.service';
import { ERequestState } from '@app/shared/models/enums/request-state.enum';
import { ReservationType } from '@app/shared/models/enums/reservation-type.enum';
import { ResourceType } from '@app/shared/models/enums/resource-type.enum';
import { IRequest } from '@app/shared/models/interfaces/request.interface';
import { ReservationRequest } from '@app/shared/models/rest-api/reservation-request.interface';
import { ICalendarItem, IEventOwner, IInterval } from '@cesnet/shongo-calendar';
import * as moment from 'moment';
import { BehaviorSubject, catchError, first, map, Observable, of } from 'rxjs';
import { Resource } from 'src/app/shared/models/rest-api/resource.interface';

@Injectable({
  providedIn: 'root',
})
export class CalendarReservationsService {
  constructor(
    private _resReqS: ReservationRequestService,
    private _alertS: AlertService,
    private _authS: AuthenticationService
  ) {}

  get currentUser(): IEventOwner {
    return {
      name: this._authS.identityClaims?.name ?? '',
      email: this._authS.identityClaims?.email ?? '',
    };
  }

  fetchInterval$(
    resources: Resource[],
    interval: IInterval
  ): Observable<IRequest<ICalendarItem[]>> {
    if (!resources?.length) {
      return of({ data: [], state: ERequestState.SUCCESS });
    }

    const type =
      resources[0].type === ResourceType.VIRTUAL_ROOM
        ? ReservationType.ROOM_CAPACITY
        : ReservationType.PHYSICAL_RESOURCE;

    const filter = new HttpParams()
      .set('interval_from', moment(interval.start).toISOString())
      .set('interval_to', moment(interval.end).toISOString())
      .set('type', type)
      .set('resource', resources?.map((res) => res.id).join(',') ?? '');

    return this._fetchInterval$(filter);
  }

  fetchCapacitiesInterval$(parentId: string, interval: IInterval) {
    const filter = new HttpParams()
      .set('interval_from', moment(interval.start).toISOString())
      .set('interval_to', moment(interval.end).toISOString())
      .set('parentRequestId', parentId);

    return this._fetchInterval$(filter);
  }

  private _createCalendarItem(reservation: ReservationRequest): ICalendarItem {
    return {
      slot: {
        start: moment(reservation.slot.start).toDate(),
        end: moment(reservation.slot.end).toDate(),
      },
      owner: {
        name: reservation.ownerName,
        email: reservation.ownerEmail,
      },
      title: reservation.description,
    };
  }

  private _fetchInterval$(
    filter: HttpParams
  ): Observable<IRequest<ICalendarItem[]>> {
    const response$ = new BehaviorSubject<IRequest<ICalendarItem[]>>({
      data: [],
      state: ERequestState.LOADING,
    });

    this._resReqS
      .fetchItems<ReservationRequest>(filter)
      .pipe(
        first(),
        map((reservations) =>
          reservations.items.map((res) => this._createCalendarItem(res))
        ),
        catchError((err) => {
          console.error(err);

          this._alertS.showError(
            $localize`:error message:Failed to fetch reservations`
          );

          return [];
        })
      )
      .subscribe((reservations) => {
        response$.next({ data: reservations, state: ERequestState.SUCCESS });
        response$.complete();
      });

    return response$.asObservable();
  }
}
