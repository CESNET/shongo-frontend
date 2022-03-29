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
import { Days } from 'src/app/shared/models/enums/days.enum';
import {
  MonthlyPeriodicityType,
  PeriodicityType,
} from 'src/app/shared/models/enums/periodicity-type.enum';
import { Option } from 'src/app/shared/models/interfaces/option.interface';
import { Periodicity } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { getFormError } from 'src/app/utils/getFormError';

@Component({
  selector: 'app-periodicity-selection-form',
  templateUrl: './periodicity-selection-form.component.html',
  styleUrls: ['./periodicity-selection-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodicitySelectionFormComponent implements OnInit {
  periodicityForm = new FormGroup({
    periodicity: new FormControl(PeriodicityType.NONE, [Validators.required]),
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
      periodicityType: new FormControl(MonthlyPeriodicityType.STANDARD, [
        Validators.required,
      ]),
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

  monthlyDayOrderOpts: Option[] = [
    { value: 1, displayName: '1.' },
    { value: 2, displayName: '2.' },
    { value: 3, displayName: '3.' },
    { value: 4, displayName: '4.' },
    { value: -1, displayName: 'last' },
  ];

  monthlyDayOpts: Option[] = [
    { value: Days.MONDAY, displayName: 'Monday' },
    { value: Days.TUESDAY, displayName: 'Tuesday' },
    { value: Days.WEDNESDAY, displayName: 'Wednesday' },
    { value: Days.THURSDAY, displayName: 'Thursday' },
    { value: Days.FRIDAY, displayName: 'Friday' },
    { value: Days.SATURDAY, displayName: 'Saturday' },
    { value: Days.SUNDAY, displayName: 'Sunday' },
  ];

  MonthlyPeriodicityType = MonthlyPeriodicityType;
  PeriodicityType = PeriodicityType;
  excludedDays = new Set<Date>();

  getFormError = getFormError;

  constructor(private _datePipe: MomentDatePipe) {}

  get valid(): boolean {
    const { periodicity: type } = this.periodicityForm.value;

    if (type === PeriodicityType.NONE) {
      return true;
    }
    return this.periodicityForm.valid;
  }

  ngOnInit(): void {
    this.periodicityForm
      .get('weeklyForm')!
      .setValidators(this._weeklyFormValidator());
  }

  getPeriodicity(): Periodicity | undefined {
    const {
      periodicity: type,
      repeatUntil,
      weeklyForm,
      monthlyForm,
    } = this.periodicityForm.value;

    if (type === PeriodicityType.NONE) {
      return {
        type,
      };
    }

    const periodicity: Periodicity = {
      type,
      periodicityEnd: moment(repeatUntil).unix() * 1000,
      excludeDates: this.getExcludedDays(),
    };

    switch (type) {
      case PeriodicityType.DAILY:
        return periodicity;
      case PeriodicityType.WEEKLY:
        const { nthWeek } = weeklyForm;
        periodicity.periodicityCycle = Number(nthWeek);
        periodicity.periodicDaysInWeek = this._getDaysInWeek();

        return periodicity;
      case PeriodicityType.MONTHLY:
        const { periodicityType } = monthlyForm;

        if (periodicityType === MonthlyPeriodicityType.SPECIFIC_DAY) {
          const { irregularForm } = monthlyForm;
          periodicity.periodicityCycle = irregularForm.nthMonth;
          periodicity.periodicDayInMonth = irregularForm.day;
          periodicity.periodicityDayOrder = irregularForm.nthDay;
        } else {
          const { regularForm } = monthlyForm;
          periodicity.periodicityCycle = regularForm.nthMonth;
        }
        return periodicity;
      default:
        return;
    }
  }

  getExcludedDays(): number[] {
    return Array.from(this.excludedDays).map(
      (date) => moment(date).unix() * 1000
    );
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
      case PeriodicityType.NONE:
        weeklyForm.disable();
        monthlyForm.disable();
        repeatUntil.disable();
        break;
      case PeriodicityType.DAILY:
        weeklyForm.disable();
        monthlyForm.disable();
        repeatUntil.enable();
        break;
      case PeriodicityType.WEEKLY:
        weeklyForm.enable();
        monthlyForm.disable();
        repeatUntil.enable();
        break;
      case PeriodicityType.MONTHLY:
        weeklyForm.disable();
        monthlyForm.enable();
        this.enableMonthlyForm(MonthlyPeriodicityType.STANDARD);
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

  enableMonthlyForm(formType: MonthlyPeriodicityType): void {
    const monthlyForm = this.periodicityForm.get('monthlyForm') as FormGroup;
    const { regularForm, irregularForm } = monthlyForm.controls;

    if (formType === MonthlyPeriodicityType.STANDARD) {
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

  private _weeklyFormValidator =
    (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors => {
      const { nthWeek, ...days } = (control as FormGroup).value;
      return Object.values(days).some((value) => value)
        ? {}
        : { noneChecked: true };
    };

  private _getDaysInWeek(): Days[] {
    const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
      this.periodicityForm.get('weeklyForm')!.value;

    const days = [];

    if (monday) {
      days.push(Days.MONDAY);
    }
    if (tuesday) {
      days.push(Days.TUESDAY);
    }
    if (wednesday) {
      days.push(Days.WEDNESDAY);
    }
    if (thursday) {
      days.push(Days.THURSDAY);
    }
    if (friday) {
      days.push(Days.FRIDAY);
    }
    if (saturday) {
      days.push(Days.SATURDAY);
    }
    if (sunday) {
      days.push(Days.SUNDAY);
    }

    return days;
  }
}
