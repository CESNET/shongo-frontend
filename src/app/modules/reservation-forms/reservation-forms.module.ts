import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdvancedSettingsFormComponent } from './components/advanced-settings-form/advanced-settings-form.component';
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
    AdvancedSettingsFormComponent,
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
    AdvancedSettingsFormComponent,
  ],
})
export class ReservationFormsModule {}
