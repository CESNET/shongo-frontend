import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
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
import { getFormError } from 'src/app/utils/getFormError';

const daysMap = new Map<Days, string>([
  [Days.MONDAY, 'monday'],
  [Days.TUESDAY, 'tuesday'],
  [Days.WEDNESDAY, 'wednesday'],
  [Days.THURSDAY, 'thursday'],
  [Days.FRIDAY, 'friday'],
  [Days.SATURDAY, 'saturday'],
  [Days.SUNDAY, 'sunday'],
]);

@Component({
  selector: 'app-periodicity-selection-form',
  templateUrl: './periodicity-selection-form.component.html',
  styleUrls: ['./periodicity-selection-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodicitySelectionFormComponent implements OnInit {
  @Input() periodicity?: Periodicity;

  readonly periodicityForm = new FormGroup({
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

  readonly monthlyDayOrderOpts: Option[] = [
    { value: 1, displayName: '1.' },
    { value: 2, displayName: '2.' },
    { value: 3, displayName: '3.' },
    { value: 4, displayName: '4.' },
    { value: -1, displayName: $localize`:text|last {day}:last` },
  ];

  readonly monthlyDayOpts: Option[] = [
    { value: Days.MONDAY, displayName: $localize`:day:Monday` },
    { value: Days.TUESDAY, displayName: $localize`:day:Tuesday` },
    { value: Days.WEDNESDAY, displayName: $localize`:day:Wednesday` },
    { value: Days.THURSDAY, displayName: $localize`:day:Thursday` },
    { value: Days.FRIDAY, displayName: $localize`:day:Friday` },
    { value: Days.SATURDAY, displayName: $localize`:day:Saturday` },
    { value: Days.SUNDAY, displayName: $localize`:day:Sunday` },
  ];

  readonly MonthlyPeriodicityType = MonthlyPeriodicityType;
  readonly PeriodicityType = PeriodicityType;
  readonly excludedDays = new Set<Date>();

  readonly getFormError = getFormError;

  constructor() {}

  /**
   * Validity of form.
   */
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

    if (this.periodicity) {
      this.fill(this.periodicity);
    }
  }

  /**
   * Fills form with periodicity object.
   *
   * @param periodicity Periodicity.
   */
  fill(periodicity: Periodicity): void {
    if (!periodicity) {
      return;
    }
    if (periodicity.type) {
      this.periodicityForm.get('periodicity')!.setValue(periodicity.type);
    }
    if (periodicity.periodicityEnd) {
      this.periodicityForm
        .get('repeatUntil')!
        .setValue(moment(periodicity.periodicityEnd).toDate());
    }
    if (periodicity.excludeDates) {
      periodicity.excludeDates.forEach((timestamp) =>
        this.excludedDays.add(moment(timestamp).toDate())
      );
    }

    if (periodicity.type === PeriodicityType.WEEKLY) {
      const weeklyForm = this.periodicityForm.get('weeklyForm')! as FormGroup;
      const { nthWeek } = weeklyForm.controls;

      if (periodicity.periodicityCycle) {
        nthWeek.setValue(periodicity.periodicityCycle);
      }
      if (periodicity.periodicDaysInWeek) {
        periodicity.periodicDaysInWeek.forEach((day) => {
          weeklyForm.get(daysMap.get(day)!)!.setValue(true);
        });
      }
    } else if (periodicity.type === PeriodicityType.MONTHLY) {
      const monthlyForm = this.periodicityForm.get('monthlyForm')! as FormGroup;

      if (periodicity.monthlyPeriodicityType) {
        monthlyForm
          .get('periodicityType')!
          .setValue(periodicity.monthlyPeriodicityType);
        this.enableMonthlyForm(periodicity.monthlyPeriodicityType);
      }

      if (
        periodicity.monthlyPeriodicityType === MonthlyPeriodicityType.STANDARD
      ) {
        const { nthMonth } = (monthlyForm.get('regularForm')! as FormGroup)
          .controls;

        if (periodicity.periodicityCycle) {
          nthMonth.setValue(periodicity.periodicityCycle);
        }
      } else if (
        periodicity.monthlyPeriodicityType ===
        MonthlyPeriodicityType.SPECIFIC_DAY
      ) {
        const { nthMonth, nthDay, day } = (
          monthlyForm.get('irregularForm')! as FormGroup
        ).controls;

        if (periodicity.periodicityCycle) {
          nthMonth.setValue(periodicity.periodicityCycle);
        }
        if (periodicity.periodicityDayOrder) {
          nthDay.setValue(periodicity.periodicityDayOrder);
        }
        if (periodicity.periodicDayInMonth) {
          day.setValue(periodicity.periodicDayInMonth);
        }
      }
    }
  }

  /**
   * Returns selected periodicity or undefined.
   *
   * @returns Selected periodicity.
   */
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
      periodicityEnd: this._toISODateString(repeatUntil),
      excludeDates: this.getExcludedDates(),
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

  /**
   * Returns excluded dates.
   *
   * @returns Array of excluded dates.
   */
  getExcludedDates(): string[] {
    return Array.from(this.excludedDays).map((date) =>
      this._toISODateString(date)
    );
  }

  /**
   * Adds excluded date created by MatDatepicker.
   *
   * @param dateInputEvent MatDatepicker input event.
   */
  addExcludedDate(dateInputEvent: MatDatepickerInputEvent<any, any>): void {
    if (!this.excludedDays.has(dateInputEvent.value)) {
      this.excludedDays.add(dateInputEvent.value);
    }
  }

  /**
   * Removes excluded date.
   *
   * @param date Date to remove.
   */
  removeExcludedDay(date: Date): void {
    this.excludedDays.delete(date);
  }

  /**
   * Enables/disables sub-forms based on periodicity type.
   *
   * @param changeEvent Periodicity group radio change event.
   */
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

  /**
   * Handles monthly radio change event.
   *
   * @param changeEvent MatRadio change event.
   */
  handleMonthlyRadioChange(changeEvent: MatRadioChange): void {
    if (changeEvent.value) {
      this.enableMonthlyForm(changeEvent.source.value);
    }
  }

  /**
   * Enables/disables monthly sub-forms based on selected periodicity type.
   *
   * @param formType Monthly periodicity type.
   */
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

  /**
   * Custom validator for monthly form, at least one of days must be selected.
   *
   * @returns Validation errors.
   */
  private _weeklyFormValidator =
    (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors => {
      const { nthWeek, ...days } = (control as FormGroup).value;
      return Object.values(days).some((value) => value)
        ? {}
        : { noneChecked: true };
    };

  /**
   * Gets selected days in week for weekly form.
   *
   * @returns Array of selected week days.
   */
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

  /**
   * Converts date to ISO date string (without time part).
   *
   * @param date Date.
   * @returns Date as ISO date string.
   */
  private _toISODateString(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }
}
