import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar-view-selection',
  templateUrl: './calendar-view-selection.component.html',
  styleUrls: ['./calendar-view-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarViewSelectionComponent {
  @Input() selectedView: CalendarView = CalendarView.Month;
  @Output() viewSelected = new EventEmitter<CalendarView>();

  readonly CalendarView = CalendarView;

  constructor() {}

  onViewSelection(view: CalendarView): void {
    this.viewSelected.emit(view);
  }
}
