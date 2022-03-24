import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatRadioChange } from '@angular/material/radio';
import * as moment from 'moment';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';

@Component({
  selector: 'app-periodicity-selection-form',
  templateUrl: './periodicity-selection-form.component.html',
  styleUrls: ['./periodicity-selection-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodicitySelectionFormComponent implements OnInit {
  periodicityForm = new FormGroup({
    periodicity: new FormControl(null, [Validators.required]),
    repeatUntil: new FormControl(null, [Validators.required]),
    weeklyForm: new FormGroup({
      nthWeek: new FormControl(1, [Validators.required]),
      monday: new FormControl(false),
      tuesday: new FormControl(false),
      wednesday: new FormControl(false),
      thursday: new FormControl(false),
      friday: new FormControl(false),
      saturday: new FormControl(false),
      sunday: new FormControl(false),
    }),
    monthlyForm: new FormGroup({
      periodicityType: new FormControl('regular', [Validators.required]),
      regularForm: new FormGroup({
        nthMonth: new FormControl(null, [Validators.required]),
      }),
      irregularForm: new FormGroup({
        nthDay: new FormControl({ value: null, disabled: true }, [
          Validators.required,
        ]),
        nthMonth: new FormControl({ value: null, disabled: true }, [
          Validators.required,
        ]),
        day: new FormControl({ value: null, disabled: true }, [
          Validators.required,
        ]),
      }),
    }),
  });

  excludedDays = new Set<Date>();

  constructor(private _datePipe: MomentDatePipe) {}

  ngOnInit(): void {
    this.periodicityForm
      .get('weeklyForm')!
      .setValidators(this._weeklyFormValidator());
  }

  addExcludedDate(dateInputEvent: MatDatepickerInputEvent<any, any>): void {
    if (!this.excludedDays.has(dateInputEvent.value)) {
      this.excludedDays.add(dateInputEvent.value);
    }
  }

  removeExcludedDay(date: Date): void {
    this.excludedDays.delete(date);
  }

  handlePeriodicityRadioChange(changeEvent: MatRadioChange): void {
    const { weeklyForm, monthlyForm, repeatUntil } =
      this.periodicityForm.controls;

    switch (changeEvent.source.value) {
      case 'none':
        weeklyForm.disable();
        monthlyForm.disable();
        repeatUntil.disable();
        break;
      case 'daily':
        weeklyForm.disable();
        monthlyForm.disable();
        repeatUntil.enable();
        break;
      case 'weekly':
        weeklyForm.enable();
        monthlyForm.disable();
        repeatUntil.enable();
        break;
      case 'monthly':
        weeklyForm.disable();
        monthlyForm.enable();
        this.enableMonthlyForm('regular');
        repeatUntil.enable();
        break;
      default:
        break;
    }
  }

  handleMonthlyRadioChange(changeEvent: MatRadioChange): void {
    if (changeEvent.value) {
      this.enableMonthlyForm(changeEvent.source.value);
    }
  }

  enableMonthlyForm(formType: 'regular' | 'irregular'): void {
    const monthlyForm = this.periodicityForm.get('monthlyForm') as FormGroup;
    const { regularForm, irregularForm } = monthlyForm.controls;

    if (formType === 'regular') {
      regularForm.enable();
      irregularForm.disable();
    } else {
      irregularForm.enable();
      regularForm.disable();
    }
  }

  getPeriodicityString(): string {
    const { periodicity, repeatUntil } = this.periodicityForm.value;
    let periodicityString;

    switch (periodicity) {
      case 'none':
        return 'None';
      case 'daily':
        periodicityString = 'Repeat daily';
        break;
      case 'weekly':
        const { nthWeek, ...days } =
          this.periodicityForm.get('weeklyForm')!.value;
        const selectedDays = Object.entries(days)
          .filter(([_, isSelected]) => isSelected)
          .map(([day, _]) => day);

        periodicityString = `Repeat every ${nthWeek}. week at ${selectedDays.join(
          ', '
        )}`;
        break;
      case 'monthly':
        const { regularForm, irregularForm, periodicityType } =
          this.periodicityForm.get('monthlyForm')!.value;

        if (periodicityType === 'irregular') {
          const { nthDay, day, nthMonth } = irregularForm;
          periodicityString = `Repeat every ${nthDay} ${day} in every ${nthMonth} month`;
        } else {
          const { nthMonth } = regularForm;
          periodicityString = `Repeat every ${nthMonth}. month`;
        }
        break;
      default:
        return '';
    }

    const res =
      `${periodicityString} until ${this._datePipe.transform(
        repeatUntil,
        'LLL'
      )}` +
      (this.excludedDays.size !== 0
        ? ` except for ${Array.from(this.excludedDays)
            .map((date: Date) => moment(date).format('LL'))
            .join(', ')}.`
        : '.');

    return res;
  }

  isCompleted(): boolean {
    return this.periodicityForm.valid;
  }

  shouldDisplayExcludedDays(): boolean {
    const periodicity = this.periodicityForm.get('periodicity')!.value;
    return periodicity && periodicity !== 'none';
  }

  private _weeklyFormValidator =
    (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors => {
      const { nthWeek, ...days } = (control as FormGroup).value;
      return Object.values(days).some((value) => value)
        ? {}
        : { noneChecked: true };
    };
}
