import { NgModule } from '@angular/core';
import { ReservationPageComponent } from './pages/reservation-page/reservation-page.component';
import { ResourceSelectionStepComponent } from './components/resource-selection-step/resource-selection-step.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TimeSlotSelectionStepComponent } from './components/time-slot-selection-step/time-slot-selection-step.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PeriodicitySelectionStepComponent } from './components/periodicity-selection-step/periodicity-selection-step.component';
import { AdditionalInformationStepComponent } from './components/additional-information-step/additional-information-step.component';
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
  ],
  declarations: [
    ReservationPageComponent,
    ResourceSelectionStepComponent,
    TimeSlotSelectionStepComponent,
    PeriodicitySelectionStepComponent,
    AdditionalInformationStepComponent,
  ],
})
export class ReservationModule {}
