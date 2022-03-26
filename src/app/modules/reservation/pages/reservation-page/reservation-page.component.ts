import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarView } from 'angular-calendar';
import { Resource } from 'src/app/models/data/resources';
import { ResourceType } from 'src/app/shared/models/enums/resource-type.enum';
import { CalendarSlot } from 'src/app/shared/models/rest-api/slot.interface';
import { ReservationDialogComponent } from '../../components/reservation-dialog/reservation-dialog.component';

@Component({
  selector: 'app-reservation-page',
  templateUrl: './reservation-page.component.html',
  styleUrls: ['./reservation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationPageComponent {
  CalendarView = CalendarView;
  selectedResource?: Resource | null = {
    id: 'pexip',
    type: ResourceType.VIRTUAL_ROOM,
    name: 'Videoconference (Pexip)',
  };
  selectedSlot?: CalendarSlot | null;

  constructor(private _dialog: MatDialog) {
    this._dialog.open(ReservationDialogComponent, {
      data: { resource: this.selectedResource },
      width: '95%',
      maxWidth: '120ch',
    });
  }

  openReservationDialog(): void {
    if (!this.selectedResource) {
      return;
    }

    this._dialog.open(ReservationDialogComponent, {
      data: { resource: this.selectedResource },
      width: '95%',
      maxWidth: '120ch',
    });
  }
}
