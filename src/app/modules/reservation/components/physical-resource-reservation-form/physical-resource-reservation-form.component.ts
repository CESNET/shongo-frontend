import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { getFormError } from 'src/app/utils/getFormError';
import { ReservationForm } from '../../models/interfaces/reservation-form.interface';
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
  implements ReservationForm
{
  @ViewChild(PeriodicitySelectionFormComponent)
  periodicityForm!: PeriodicitySelectionFormComponent;

  readonly form = new FormGroup({
    description: new FormControl(null, [
      Validators.required,
      Validators.maxLength(ROOM_DESCRIPTION_MAXLENGTH),
    ]),
    timezone: new FormControl(null, [Validators.required]),
  });

  readonly getFormError = getFormError;
  readonly descriptionErrorHandler = descriptionErrorHandler;

  constructor(private _settings: SettingsService) {
    this.form.patchValue({ timezone: this._settings.timeZone });
  }

  get valid(): boolean {
    return (
      this.periodicityForm && this.periodicityForm.valid && this.form.valid
    );
  }

  getFormValue(): any {
    const periodicity = this.periodicityForm.getPeriodicity();
    return { periodicity, ...this.form.value };
  }
}
