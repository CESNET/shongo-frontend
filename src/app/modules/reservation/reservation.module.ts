import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ShongoCalendarModule } from '@cesnet/shongo-calendar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarHelperModule } from '../calendar-helper/calendar-helper.module';
import { ReservationFormsModule } from '../reservation-forms/reservation-forms.module';
import { CalendarSidebarComponent } from './components/calendar-sidebar/calendar-sidebar.component';
import { DropdownSectionComponent } from './components/dropdown-section/dropdown-section.component';
import { ReservationDialogComponent } from './components/reservation-dialog/reservation-dialog.component';
import { ResourceSelectionFormComponent } from './components/resource-selection-form/resource-selection-form.component';
import { CALENDAR_TRANSLATIONS } from './constants';
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
    MatDatepickerModule,
    MatRippleModule,
    ShongoCalendarModule.forRoot(CALENDAR_TRANSLATIONS),
    CalendarHelperModule,
  ],
  exports: [ResourceSelectionFormComponent],
  declarations: [
    ReservationPageComponent,
    ResourceSelectionFormComponent,
    ReservationDialogComponent,
    HoldClickDirective,
    DropdownSectionComponent,
    CalendarSidebarComponent,
  ],
})
export class ReservationModule {}
