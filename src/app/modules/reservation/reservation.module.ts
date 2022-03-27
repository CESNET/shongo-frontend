import { NgModule } from '@angular/core';
import { ReservationPageComponent } from './pages/reservation-page/reservation-page.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReservationRoutingModule } from './reservation-routing.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { ResourceSelectionFormComponent } from './components/resource-selection-form/resource-selection-form.component';
import { PeriodicitySelectionFormComponent } from './components/periodicity-selection-form/periodicity-selection-form.component';
import { PhysicalResourceReservationFormComponent } from './components/physical-resource-reservation-form/physical-resource-reservation-form.component';
import { TeleconferenceReservationFormComponent } from './components/teleconference-reservation-form/teleconference-reservation-form.component';
import { VideoconferenceReservationFormComponent } from './components/videoconference-reservation-form/videoconference-reservation-form.component';
import { WebconferenceReservationFormComponent } from './components/webconference-reservation-form/webconference-reservation-form.component';
import { ReservationDialogComponent } from './components/reservation-dialog/reservation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReservationRoutingModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatRadioModule,
    MatDividerModule,
    MatCheckboxModule,
    MatInputModule,
    MatMomentDateModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatDialogModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    ReservationPageComponent,
    PeriodicitySelectionFormComponent,
    ResourceSelectionFormComponent,
    PhysicalResourceReservationFormComponent,
    VideoconferenceReservationFormComponent,
    WebconferenceReservationFormComponent,
    TeleconferenceReservationFormComponent,
    ReservationDialogComponent,
  ],
})
export class ReservationModule {}
