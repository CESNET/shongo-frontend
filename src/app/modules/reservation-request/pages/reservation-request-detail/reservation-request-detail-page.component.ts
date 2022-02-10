import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ReservationRequest } from 'src/app/shared/models/rest-api/reservation-request.interface';

@Component({
  selector: 'app-reservation-request-detail-page',
  templateUrl: './reservation-request-detail-page.component.html',
  styleUrls: ['./reservation-request-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationRequestDetailPageComponent {
  reservationRequest$: Observable<ReservationRequest>;
  loading$ = new BehaviorSubject(true);

  constructor(
    private _resReqService: ReservationRequestService,
    private _route: ActivatedRoute
  ) {
    this.reservationRequest$ = this._route.params.pipe(
      switchMap((params) =>
        this._resReqService.fetchItem<ReservationRequest>(params.id)
      ),
      tap(() => this.loading$.next(false)),
      catchError((err) => {
        this.loading$.next(false);
        return throwError(err);
      })
    );
  }
}