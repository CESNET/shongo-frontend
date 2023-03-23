import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ReservationForm } from 'src/app/modules/reservation-forms/interfaces/reservation-form.interface';
import { AlertType } from 'src/app/shared/models/enums/alert-type.enum';
import { ReservationRequestState } from 'src/app/shared/models/enums/reservation-request-state.enum';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { Slot } from 'src/app/shared/models/rest-api/slot.interface';
import { EditReservationRequestBody } from 'src/app/shared/models/types/edit-reservation-request-body.type';
import { getFormError } from 'src/app/utils/get-form-error';
import { RequestNotEditableError } from './errors/request-not-editable.error';

@Component({
  selector: 'app-edit-reservation-request-page',
  templateUrl: './edit-reservation-request-page.component.html',
  styleUrls: ['./edit-reservation-request-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditReservationRequestPageComponent implements OnInit {
  @ViewChild('reservationForm') reservationForm?: ReservationForm;

  readonly slotForm = new UntypedFormGroup({
    startDate: new UntypedFormControl(moment().toDate(), [Validators.required]),
    startTime: new UntypedFormControl(moment().toDate(), [Validators.required]),
    endDate: new UntypedFormControl(null, [Validators.required]),
    endTime: new UntypedFormControl(null, [Validators.required]),
  });
  readonly editing$ = new BehaviorSubject(false);
  readonly loading$ = new BehaviorSubject(false);
  readonly ReservationType = ReservationType;
  readonly Technology = Technology;
  readonly AlertType = AlertType;

  readonly getFormError = getFormError;

  reservationRequest?: ReservationRequestDetail;
  error?: Error;

  constructor(
    private _resReqService: ReservationRequestService,
    private _route: ActivatedRoute,
    private _alert: AlertService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._fetchReservationRequest(this._route.snapshot.params.id);
  }

  /**
   * Returns form validity.
   *
   * @returns True if form is valid.
   */
  isValid(): boolean {
    return this.reservationForm
      ? this.slotForm.valid && this.reservationForm.valid
      : false;
  }

  /**
   * Creates reservation request edit request.
   */
  editRequest(): void {
    const request = this._createEditRequestBody();

    this.editing$.next(true);

    this._resReqService
      .edit(this.reservationRequest!.id, request)
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

  /**
   * Creates reservation request edit body.
   *
   * @returns Reservation request edit body.
   */
  private _createEditRequestBody(): EditReservationRequestBody {
    const { startDate, startTime, endDate, endTime } = this.slotForm.value;
    const { timezone, ...reservationFormValue } =
      this.reservationForm!.getFormValue();

    const start = this._getSlotPart(startDate, startTime, timezone);
    const end = this._getSlotPart(endDate, endTime, timezone);
    const slot = { start, end } as Slot;

    return { slot, ...reservationFormValue };
  }

  /**
   * Gets slot part as a complete ISO string (date + time).
   *
   * @param partDate Date only part of Date.
   * @param partTime Time only part of Date.
   * @param timezone Timezone.
   * @returns Date ISO string.
   */
  private _getSlotPart(
    partDate: string,
    partTime: string,
    timezone?: string
  ): string {
    const [hours, minutes] = partTime.split(':') as [string, string];
    const momentDate = moment(partDate)
      .set({
        hours: Number(hours),
        minutes: Number(minutes),
      })
      .tz(timezone ?? moment.tz.guess());

    return momentDate.toISOString();
  }

  /**
   * Fetches reservation request by ID.
   *
   * @param requestId Reservation request ID.
   */
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
          } else {
            this._fillSlotForm(resReq.slot);
          }
        }),
        catchError((err) => {
          console.error(err);
          this.error = err;
          throw err;
        }),
        finalize(() => this.loading$.next(false))
      )
      .subscribe((resReq) => (this.reservationRequest = resReq));
  }

  /**
   * Fills slot form with slot data.
   *
   * @param slot Slot.
   */
  private _fillSlotForm(slot: Slot): void {
    this.slotForm.patchValue({
      startDate: moment(slot.start).toDate(),
      startTime: moment(slot.start).format('HH:mm'),
      endDate: moment(slot.end).toDate(),
      endTime: moment(slot.end).format('HH:mm'),
    });
  }
}
