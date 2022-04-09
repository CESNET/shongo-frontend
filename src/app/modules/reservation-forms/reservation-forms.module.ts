import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodicitySelectionFormComponent } from './components/periodicity-selection-form/periodicity-selection-form.component';
import { PhysicalResourceReservationFormComponent } from './components/physical-resource-reservation-form/physical-resource-reservation-form.component';
import { TeleconferenceReservationFormComponent } from './components/teleconference-reservation-form/teleconference-reservation-form.component';
import { VideoconferenceReservationFormComponent } from './components/videoconference-reservation-form/videoconference-reservation-form.component';
import { WebconferenceReservationFormComponent } from './components/webconference-reservation-form/webconference-reservation-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { VirtualRoomReservationFormComponent } from './components/virtual-room-reservation-form/virtual-room-reservation-form.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    PeriodicitySelectionFormComponent,
    PhysicalResourceReservationFormComponent,
    TeleconferenceReservationFormComponent,
    VideoconferenceReservationFormComponent,
    WebconferenceReservationFormComponent,
    VirtualRoomReservationFormComponent,
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatRadioModule,
    MatChipsModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    SharedModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    PeriodicitySelectionFormComponent,
    PhysicalResourceReservationFormComponent,
    TeleconferenceReservationFormComponent,
    VideoconferenceReservationFormComponent,
    WebconferenceReservationFormComponent,
    VirtualRoomReservationFormComponent,
  ],
})
export class ReservationFormsModule {}
