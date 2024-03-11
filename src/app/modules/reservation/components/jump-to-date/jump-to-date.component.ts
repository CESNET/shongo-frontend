import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-jump-to-date',
  templateUrl: './jump-to-date.component.html',
  styleUrls: ['./jump-to-date.component.scss'],
})
export class JumpToDateComponent {
  @Output() dateSelected = new EventEmitter<Date>();

  onDateSelection(moment: moment.Moment): void {
    this.dateSelected.emit(moment.toDate());
  }
}
