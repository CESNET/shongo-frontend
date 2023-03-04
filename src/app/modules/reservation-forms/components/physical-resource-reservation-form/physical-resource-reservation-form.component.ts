import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { PhysicalResourceReservationRequest } from 'src/app/shared/models/rest-api/physical-resource-reservation-request.interface';
import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { getFormError } from 'src/app/utils/get-form-error';
import { ReservationForm } from '../../interfaces/reservation-form.interface';
import { descriptionErrorHandler } from '../../utils/custom-error-handlers';
import { ROOM_DESCRIPTION_MAXLENGTH } from '../../utils/reservation-form.constants';
import { PeriodicitySelectionFormComponent } from '../periodicity-selection-form/periodicity-selection-form.component';

@Component({
  selector: 'app-physical-resource-reservation-form',
  templateUrl: './physical-resource-reservation-form.component.html',
  styleUrls: [
    './physical-resource-reservation-form.component.scss',
    '../../styles/resource-reservation-form.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhysicalResourceReservationFormComponent
  implements ReservationForm, AfterViewInit
{
  @ViewChild(PeriodicitySelectionFormComponent)
  periodicityForm!: PeriodicitySelectionFormComponent;

  @Input() editedRequest?: ReservationRequestDetail | undefined;

  readonly form = new UntypedFormGroup({
    description: new UntypedFormControl(null, [
      Validators.required,
      Validators.maxLength(ROOM_DESCRIPTION_MAXLENGTH),
    ]),
    timezone: new UntypedFormControl(null, [Validators.required]),
  });

  readonly getFormError = getFormError;
  readonly descriptionErrorHandler = descriptionErrorHandler;

  constructor(private _settings: SettingsService) {
    this.form.patchValue({ timezone: this._settings.timeZone });
  }

  /**
   * Form validity.
   */
  get valid(): boolean {
    return (
      this.periodicityForm && this.periodicityForm.valid && this.form.valid
    );
  }

  ngAfterViewInit(): void {
    if (this.editedRequest) {
      this.fill(this.editedRequest);
    }
  }

  /**
   * Fills form with reservation request detail.
   *
   * @param param0 Reservation request detail.
   */
  fill({ description, physicalResourceData }: ReservationRequestDetail): void {
    if (description) {
      this.form.get('description')!.setValue(description);
    }
    if (physicalResourceData?.periodicity) {
      this.periodicityForm.fill(physicalResourceData.periodicity);
    }
  }

  /**
   * Returns form value.
   *
   * @returns Form value.
   */
  getFormValue(): PhysicalResourceReservationRequest {
    const periodicity = this.periodicityForm.getPeriodicity();
    return { periodicity, ...this.form.value };
  }
}
