import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  ViewChild,
  Type,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Resource } from 'src/app/models/data/resources';
import { ComponentHostDirective } from 'src/app/shared/directives/component-host.directive';
import { ResourceType } from 'src/app/shared/models/enums/resource-type.enum';
import { ReservationForm } from '../../models/reservation-form.interface';
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

  constructor(@Inject(MAT_DIALOG_DATA) private _data: { resource: Resource }) {}

  ngOnInit(): void {
    this.renderFormComponent();
  }

  renderFormComponent(): void {
    let component: Type<ReservationForm>;

    if (
      this._data.resource.type === ResourceType.MEETING_ROOM ||
      this._data.resource.type === ResourceType.PARKING_PLACE
    ) {
      component = PhysicalResourceReservationFormComponent;
    } else if (this._data.resource.id === 'pexip') {
      component = VideoconferenceReservationFormComponent;
    } else if (this._data.resource.id === 'adobe_connect') {
      component = WebconferenceReservationFormComponent;
    } else if (this._data.resource.id === 'teleconference') {
      component = TeleconferenceReservationFormComponent;
    } else {
      throw new Error('Unsupported resource type.');
    }

    const viewContainerRef = this.formHost.viewContainerRef;
    viewContainerRef.clear();
    this.formComponent =
      viewContainerRef.createComponent<ReservationForm>(component).instance;
  }
}
