import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatRadioChange } from '@angular/material/radio';
import { TimeSlot } from 'src/app/models/interfaces/time-slot.interface';

@Component({
  selector: 'app-periodicity-selection-step',
  templateUrl: './periodicity-selection-step.component.html',
  styleUrls: ['./periodicity-selection-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodicitySelectionStepComponent implements OnInit {
  @Input() selectedSlot?: TimeSlot;

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

  excludedDays: Date[] = [];

  constructor() {}

  ngOnInit(): void {
    this.selectedSlot = {
      start: new Date(2022, 1, 8, 14, 0, 0, 0),
      end: new Date(2022, 1, 8, 14, 30, 0, 0),
    };
  }

  addExcludedDate(dateInputEvent: MatDatepickerInputEvent<any, any>): void {
    if (
      this.excludedDays.every(
        (date) => date.getTime() !== dateInputEvent.value.getTime()
      )
    ) {
      this.excludedDays.push(dateInputEvent.value);
    }
  }

  removeExcludedDay(date: Date): void {
    this.excludedDays = this.excludedDays.filter(
      (currentDay) => currentDay !== date
    );
  }

  handlePeriodicityRadioChange(changeEvent: MatRadioChange): void {
    const { weeklyForm, monthlyForm } = this.periodicityForm.controls;

    if (changeEvent.source.value === 'weekly') {
      weeklyForm.enable();
      monthlyForm.disable();
    } else if (changeEvent.source.value === 'monthly') {
      weeklyForm.disable();
      monthlyForm.enable();
      this.enableMonthlyForm('regular');
    } else {
      weeklyForm.disable();
      monthlyForm.disable();
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
}
