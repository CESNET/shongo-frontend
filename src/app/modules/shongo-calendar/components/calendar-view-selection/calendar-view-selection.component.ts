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

  calendarViewOpts: CalendarViewOption[] = [
    { displayName: $localize`Day`, value: CalendarView.Day },
    { displayName: $localize`Week`, value: CalendarView.Week },
    { displayName: $localize`Month`, value: CalendarView.Month },
  ];

  readonly CalendarView = CalendarView;

  constructor() {}

  onViewSelection(view: CalendarView): void {
    this.viewSelected.emit(view);
  }
}
