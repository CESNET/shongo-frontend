import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReservationFormsModule } from '../reservation-forms/reservation-forms.module';
import { ShongoCalendarModule } from '../shongo-calendar/shongo-calendar.module';
import { ReservationDialogComponent } from './components/reservation-dialog/reservation-dialog.component';
import { ResourceSelectionFormComponent } from './components/resource-selection-form/resource-selection-form.component';
import { HoldClickDirective } from './directives/hold-click.directive';
import { ReservationPageComponent } from './pages/reservation-page/reservation-page.component';
import { ReservationRoutingModule } from './reservation-routing.module';

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
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    ReservationFormsModule,
    ShongoCalendarModule,
    MatDatepickerModule,
    MatRippleModule,
  ],
  declarations: [
    ReservationPageComponent,
    ResourceSelectionFormComponent,
    ReservationDialogComponent,
    HoldClickDirective,
  ],
})
export class ReservationModule {}
