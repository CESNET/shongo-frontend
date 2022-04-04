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
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { ResourceSelectionFormComponent } from './components/resource-selection-form/resource-selection-form.component';
import { ReservationDialogComponent } from './components/reservation-dialog/reservation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReservationFormsModule } from '../reservation-forms/reservation-forms.module';
import { ShongoCalendarModule } from '../shongo-calendar/shongo-calendar.module';

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
    MatDividerModule,
    MatCheckboxModule,
    MatInputModule,
    MatMomentDateModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ReservationFormsModule,
    ShongoCalendarModule,
  ],
  declarations: [
    ReservationPageComponent,
    ResourceSelectionFormComponent,
    ReservationDialogComponent,
  ],
})
export class ReservationModule {}
