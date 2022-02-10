import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { ReservationPageComponent } from './pages/reservation-page/reservation-page.component';
import { ResourceSelectionStepComponent } from './components/resource-selection-step/resource-selection-step.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TimeSlotSelectionStepComponent } from './components/time-slot-selection-step/time-slot-selection-step.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PeriodicitySelectionStepComponent } from './components/periodicity-selection-step/periodicity-selection-step.component';
import { AdditionalInformationStepComponent } from './components/additional-information-step/additional-information-step.component';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMatSelectSearchModule,
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
