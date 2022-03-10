import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ReservationCalendarComponent } from 'src/app/shared/components/reservation-calendar/reservation-calendar.component';
import { TimeSlot } from 'src/app/shared/models/rest-api/time-slot.interface';

@Component({
  selector: 'app-time-slot-selection-step',
  templateUrl: './time-slot-selection-step.component.html',
  styleUrls: ['./time-slot-selection-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotSelectionStepComponent {
  @ViewChild(ReservationCalendarComponent)
  calendar!: ReservationCalendarComponent;
  @Input() selectedResourceId$!: Observable<string | null>;

  get selectedSlot(): TimeSlot | undefined {
    if (this.calendar && this.calendar.createdEvent) {
      return {
        start: this.calendar.createdEvent.start,
        end: this.calendar.createdEvent.end!,
      };
    }
    return;
  }

  constructor() {}

  isCompleted(): boolean {
    return (
      this.calendar &&
      this.calendar.createdEvent !== undefined &&
      this.calendar.createdEvent !== null
    );
  }
}
