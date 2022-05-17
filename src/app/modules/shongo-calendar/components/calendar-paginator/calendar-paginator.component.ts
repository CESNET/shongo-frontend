import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar-paginator',
  templateUrl: './calendar-paginator.component.html',
  styleUrls: ['./calendar-paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarPaginatorComponent {
  @Input() view!: CalendarView;
  @Input() viewDate!: Date;
  @Output() viewDateChange = new EventEmitter<Date>();

  onViewDateChange(viewDateChange: Date): void {
    this.viewDateChange.emit(viewDateChange);
  }
}
