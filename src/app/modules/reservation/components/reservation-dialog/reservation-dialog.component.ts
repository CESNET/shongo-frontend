import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  ViewChild,
  Type,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ComponentHostDirective } from 'src/app/shared/directives/component-host.directive';
import { ResourceType } from 'src/app/shared/models/enums/resource-type.enum';
import { VirtualRoomTag } from 'src/app/shared/models/enums/virtual-room-tag.enum';
import { Resource } from 'src/app/shared/models/rest-api/resource.interface';
import { CalendarSlot } from 'src/app/shared/models/rest-api/slot.interface';
import { ReservationForm } from '../../models/interfaces/reservation-form.interface';
import { PhysicalResourceReservationFormComponent } from '../physical-resource-reservation-form/physical-resource-reservation-form.component';
import { TeleconferenceReservationFormComponent } from '../teleconference-reservation-form/teleconference-reservation-form.component';
import { VideoconferenceReservationFormComponent } from '../videoconference-reservation-form/videoconference-reservation-form.component';
import { WebconferenceReservationFormComponent } from '../webconference-reservation-form/webconference-reservation-form.component';

@Component({
  selector: 'app-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationDialogComponent implements OnInit {
  @ViewChild(ComponentHostDirective, { static: true })
  formHost!: ComponentHostDirective;
  formComponent!: ReservationForm;

  readonly creating$ = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _data: { resource: Resource; slot: CalendarSlot },
    private _dialogRef: MatDialogRef<ReservationDialogComponent>,
    private _resReqService: ReservationRequestService,
    private _alert: AlertService
  ) {}

  ngOnInit(): void {
    this.renderFormComponent();
  }

  createReservationRequest(): void {
    this.creating$.next(true);

    this._createReservationRequest().subscribe({
      next: () => {
        this.creating$.next(false);
        this._alert.showSuccess('Reservation request created successfully.');
        this._dialogRef.close(true);
      },
      error: () => {
        this.creating$.next(false);
        this._alert.showError('Failed to create reservation request.');
      },
    });
  }

  renderFormComponent(): void {
    let component: Type<ReservationForm>;

    if (this._data.resource.type === ResourceType.PHYSICAL_RESOURCE) {
      component = PhysicalResourceReservationFormComponent;
    } else if (this._data.resource.tag === VirtualRoomTag.VIDEOCONFERENCE) {
      component = VideoconferenceReservationFormComponent;
    } else if (this._data.resource.tag === VirtualRoomTag.WEBCONFERENCE) {
      component = WebconferenceReservationFormComponent;
    } else if (this._data.resource.tag === VirtualRoomTag.TELECONFERENCE) {
      component = TeleconferenceReservationFormComponent;
    } else {
      throw new Error('Unsupported resource type.');
    }

    const viewContainerRef = this.formHost.viewContainerRef;
    viewContainerRef.clear();
    this.formComponent =
      viewContainerRef.createComponent<ReservationForm>(component).instance;
  }

  private _createReservationRequest(): Observable<unknown> {
    const request = this.formComponent.getFormValue();
    const reservationRequest = {
      resource: this._data.resource.id,
      slot: {
        start: moment(this._data.slot.start).unix() * 1000,
        end: moment(this._data.slot.end).unix() * 1000,
      },
      ...request,
    };
    return this._resReqService.postItem(reservationRequest).pipe(first());
  }
}
