import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertType } from '@app/shared/models/enums/alert-type.enum';
import { ReservationRequestDetail } from '@app/shared/models/rest-api/reservation-request.interface';
import { Resource } from '@app/shared/models/rest-api/resource.interface';
import { CalendarSlot } from '@app/shared/models/rest-api/slot.interface';
import { ShongoCalendarComponent } from '@cesnet/shongo-calendar';
import * as moment from 'moment';
import { first } from 'rxjs';
import { ParentRequestPropertyError } from '../../models/errors/parent-request-property.error';
import { ReservationDialogComponent } from '../reservation-dialog/reservation-dialog.component';

@Component({
  selector: 'app-calendar-sidebar',
  templateUrl: './calendar-sidebar.component.html',
  styleUrls: ['./calendar-sidebar.component.scss'],
})
export class CalendarSidebarComponent {
  @Input({ required: true }) calendar!: ShongoCalendarComponent;

  @Input() selectedResource?: Resource | null;
  @Input() selectedSlot?: CalendarSlot | null;
  @Input() parentReservationRequest?: ReservationRequestDetail;
  @Input() parentRequestError?: Error;
  @Input() capacityBookingMode = false;
  @Input() loadingParentRequest = false;

  @Output() readonly reloadParentRequest = new EventEmitter<void>();
  @Output() readonly selectedResourceChange =
    new EventEmitter<Resource | null>();
  @Output() readonly displayedResourcesChange = new EventEmitter<Resource[]>();

  readonly AlertType = AlertType;

  constructor(private _dialog: MatDialog, private _router: Router) {}

  /**
   * Checks if an error with property of parent request for capacity booking occured.
   *
   * @returns True if parent propert error occured, else false.
   */
  get parentPropertyErrorOccured(): boolean {
    return (
      this.parentRequestError !== undefined &&
      this.parentRequestError instanceof ParentRequestPropertyError
    );
  }

  /**
   * Opens reservation dialog with reservation data.
   */
  openReservationDialog(): void {
    if (!this.selectedResource) {
      return;
    }

    const dialogRef = this._dialog.open(ReservationDialogComponent, {
      data: {
        resource: this.selectedResource,
        slot: this.selectedSlot,
        parentRequest: this.parentReservationRequest,
      },
      width: '95%',
      maxWidth: '90rem',
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((id) => {
        if (id) {
          this._router.navigate(['reservation-request', id]);
        }
      });
  }

  onClearSelectedSlot(): void {
    this.calendar.clearSelectedSlot();
  }

  /**
   * Increments selected slot part by a given increment in minutes.
   * Prevents setting slot start and end to an equal date.
   *
   * @param part Start or end of slot.
   * @param increment Value of minute increment.
   */
  onIncrementSlot(part: 'start' | 'end', increment: 1 | -1): void {
    if (!this.selectedSlot) {
      throw new Error('No slot has been selected yet.');
    }

    const incrementedSlot = Object.assign({}, this.selectedSlot);
    incrementedSlot[part] = moment(incrementedSlot[part])
      .add(increment, 'minutes')
      .toDate();

    if (moment(incrementedSlot.start).isSame(moment(incrementedSlot.end))) {
      return;
    }

    this.selectedSlot = incrementedSlot;
    this.calendar.selectedSlot = incrementedSlot;
  }

  onHighlightMineChange(checked: boolean): void {
    this.calendar.highlightUsersReservations = checked;
  }

  onReloadParentRequest(): void {
    this.reloadParentRequest.emit();
  }

  onSelectedResourceChange(resource: Resource | null): void {
    this.selectedResourceChange.emit(resource);
  }

  onDisplayedResourcesChange(resources: Resource[]): void {
    this.displayedResourcesChange.emit(resources);
  }

  onDateSelection(date: Date): void {
    this.calendar.viewDate = date;
  }
}
