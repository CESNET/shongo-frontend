import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from 'src/app/shared/shared.module';
import { PeriodicitySelectionFormComponent } from './components/periodicity-selection-form/periodicity-selection-form.component';
import { PhysicalResourceReservationFormComponent } from './components/physical-resource-reservation-form/physical-resource-reservation-form.component';
import { TeleconferenceReservationFormComponent } from './components/teleconference-reservation-form/teleconference-reservation-form.component';
import { VideoconferenceReservationFormComponent } from './components/videoconference-reservation-form/videoconference-reservation-form.component';
import { VirtualRoomReservationFormComponent } from './components/virtual-room-reservation-form/virtual-room-reservation-form.component';
import { WebconferenceReservationFormComponent } from './components/webconference-reservation-form/webconference-reservation-form.component';

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
