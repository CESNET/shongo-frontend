import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { finalize, first, tap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { AlertType } from 'src/app/shared/models/enums/alert-type.enum';
import { ReservationRequestState } from 'src/app/shared/models/enums/reservation-request-state.enum';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { RequestNotEditableError } from './errors/request-not-editable.error';

@Component({
  selector: 'app-edit-reservation-request-page',
  templateUrl: './edit-reservation-request-page.component.html',
  styleUrls: ['./edit-reservation-request-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditReservationRequestPageComponent implements OnInit {
  reservationRequest?: ReservationRequestDetail;
  error?: Error;

  readonly loading$ = new BehaviorSubject(false);
  readonly ReservationType = ReservationType;
  readonly Technology = Technology;
  readonly AlertType = AlertType;

  constructor(
    private _resReqService: ReservationRequestService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._fetchReservationRequest(this._route.snapshot.params.id);
  }

  private _fetchReservationRequest(requestId: string): void {
    this.loading$.next(true);

    this._resReqService
      .fetchItem<ReservationRequestDetail>(requestId)
      .pipe(
        first(),
        tap((resReq) => {
          if (
            !resReq.isWritable ||
            resReq.state === ReservationRequestState.ALLOCATED_FINISHED
          ) {
            throw new RequestNotEditableError();
          }
        }),
        finalize(() => this.loading$.next(false))
      )
      .subscribe({
        next: (resReq) => {
          this.reservationRequest = resReq;
        },
        error: (err) => {
          console.error(err);
          this.error = err;
        },
      });
  }
}
