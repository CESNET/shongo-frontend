import { BreakpointState } from '@angular/cdk/layout';
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { Observable } from 'rxjs';
import { Option } from 'src/app/shared/models/interfaces/option.interface';

type CalendarViewOption = Option & { value: CalendarView };

@Component({
  selector: 'app-calendar-view-selection',
  templateUrl: './calendar-view-selection.component.html',
  styleUrls: ['./calendar-view-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarViewSelectionComponent {
  @Input() selectedView: CalendarView = CalendarView.Month;
  @Input() tabletSizeHit$?: Observable<BreakpointState>;
  @Output() viewSelected = new EventEmitter<CalendarView>();

  readonly calendarViewOpts: CalendarViewOption[] = [
    { displayName: $localize`:time unit:Day`, value: CalendarView.Day },
    { displayName: $localize`:time unit:Week`, value: CalendarView.Week },
    { displayName: $localize`:time unit:Month`, value: CalendarView.Month },
  ];

  readonly CalendarView = CalendarView;

  get selectedViewDisplayName(): string {
    return this.calendarViewOpts.find(opt => opt.value === this.selectedView)?.displayName ?? '';
  }

  onViewSelection(view: CalendarView): void {
    this.viewSelected.emit(view);
  }
}
