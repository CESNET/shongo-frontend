import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarView } from 'angular-calendar';
import { first } from 'rxjs/operators';
import { Resource } from 'src/app/models/data/resources';
import { ReservationCalendarComponent } from 'src/app/shared/components/reservation-calendar/reservation-calendar.component';
import { CalendarSlot } from 'src/app/shared/models/rest-api/slot.interface';
import { ReservationDialogComponent } from '../../components/reservation-dialog/reservation-dialog.component';

@Component({
  selector: 'app-reservation-page',
  templateUrl: './reservation-page.component.html',
  styleUrls: ['./reservation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationPageComponent {
  @ViewChild(ReservationCalendarComponent)
  calendar!: ReservationCalendarComponent;

  CalendarView = CalendarView;
  selectedResource?: Resource | null;
  selectedSlot?: CalendarSlot | null;

  constructor(private _dialog: MatDialog) {}

  openReservationDialog(): void {
    if (!this.selectedResource) {
      return;
    }

    const dialogRef = this._dialog.open(ReservationDialogComponent, {
      data: { resource: this.selectedResource, slot: this.selectedSlot },
      width: '95%',
      maxWidth: '120ch',
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result) {
          this.calendar.clearSelectedSlot();
          this.calendar.fetchReservations();
        }
      });
  }
}
