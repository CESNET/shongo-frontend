import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { finalize, first, tap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ReservationForm } from 'src/app/modules/reservation-forms/interfaces/reservation-form.interface';
import { AlertType } from 'src/app/shared/models/enums/alert-type.enum';
import { ReservationRequestState } from 'src/app/shared/models/enums/reservation-request-state.enum';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { Slot } from 'src/app/shared/models/rest-api/slot.interface';
import { ReservationRequestPostBody } from 'src/app/shared/models/types/reservation-request-post-body.type';
import { getFormError } from 'src/app/utils/getFormError';
import { RequestNotEditableError } from './errors/request-not-editable.error';

type EditRequestBody = Omit<ReservationRequestPostBody, 'timezone'> & {
  slot: Slot;
};

@Component({
  selector: 'app-edit-reservation-request-page',
  templateUrl: './edit-reservation-request-page.component.html',
  styleUrls: ['./edit-reservation-request-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditReservationRequestPageComponent implements OnInit {
  @ViewChild('reservationForm') reservationForm?: ReservationForm;

  readonly slotForm = new FormGroup({
    startDate: new FormControl(moment().toDate(), [Validators.required]),
    startTime: new FormControl(moment().toDate(), [Validators.required]),
    endDate: new FormControl(null, [Validators.required]),
    endTime: new FormControl(null, [Validators.required]),
  });
  readonly getFormError = getFormError;
  readonly editing$ = new BehaviorSubject(false);

  reservationRequest?: ReservationRequestDetail;
  error?: Error;

  readonly loading$ = new BehaviorSubject(false);
  readonly ReservationType = ReservationType;
  readonly Technology = Technology;
  readonly AlertType = AlertType;

  constructor(
    private _resReqService: ReservationRequestService,
    private _route: ActivatedRoute,
    private _alert: AlertService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._fetchReservationRequest(this._route.snapshot.params.id);
  }

  isValid(): boolean {
    return this.reservationForm
      ? this.slotForm.valid && this.reservationForm.valid
      : false;
  }

  editRequest(): void {
    const request = this._createEditRequestBody();

    this.editing$.next(true);

    this._resReqService
      .putItem(this.reservationRequest!.id, request)
      .pipe(
        first(),
        finalize(() => this.editing$.next(false))
      )
      .subscribe({
        next: () => {
          this._alert.showSuccess(
            $localize`:success message:Reservation request edited`
          );
          this._router.navigate(['../'], { relativeTo: this._route });
        },
        error: (err) => {
          console.error(err);
          this._alert.showError(
            $localize`:error message:Failed to edit reservation request`
          );
        },
      });
  }

  private _createEditRequestBody(): EditRequestBody {
    const { startDate, startTime, endDate, endTime } = this.slotForm.value;
    const { timezone, ...reservationFormValue } =
      this.reservationForm!.getFormValue();

    const start = this._getSlotPartTimestamp(startDate, startTime, timezone);
    const end = this._getSlotPartTimestamp(endDate, endTime, timezone);
    const slot = { start, end } as Slot;

    return { slot, ...reservationFormValue };
  }

  private _getSlotPartTimestamp(
    partDate: string,
    partTime: string,
    timezone?: string
  ): number {
    const [hours, minutes] = partTime.split(':') as [string, string];
    let momentDate = moment(partDate).set({
      hours: Number(hours),
      minutes: Number(minutes),
    });

    if (timezone) {
      momentDate = momentDate.tz(timezone);
    }

    return momentDate.unix() * 1000;
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
          this._fillSlotForm(resReq.slot);
        },
        error: (err) => {
          console.error(err);
          this.error = err;
        },
      });
  }

  private _fillSlotForm(slot: Slot): void {
    this.slotForm.patchValue({
      startDate: moment(slot.start).toDate(),
      startTime: moment(slot.start).format('HH:mm'),
      endDate: moment(slot.end).toDate(),
      endTime: moment(slot.end).format('HH:mm'),
    });
  }
}
