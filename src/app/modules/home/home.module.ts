import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ShongoCalendarModule } from '@cesnet/shongo-calendar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarHelperModule } from '../calendar-helper/calendar-helper.module';
import { ShongoTableModule } from '../shongo-table/shongo-table.module';
import { ReservationCalendarTabComponent } from './components/reservation-calendar-tab/reservation-calendar-tab.component';
import { ReservationRequestFilterComponent } from './components/reservation-request-filter/reservation-request-filter.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

@NgModule({
  declarations: [
    HomePageComponent,
    ReservationRequestFilterComponent,
    ReservationCalendarTabComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMomentDateModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonToggleModule,
    NgxMatSelectSearchModule,
    ShongoCalendarModule.forRoot(),
    ShongoTableModule,
    CalendarHelperModule,
  ],
})
export class HomeModule {}
