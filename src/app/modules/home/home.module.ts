import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservationRequestFilterComponent } from './components/reservation-request-filter/reservation-request-filter.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReservationCalendarTabComponent } from './components/reservation-calendar-tab/reservation-calendar-tab.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ShongoCalendarModule } from '../shongo-calendar/shongo-calendar.module';

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
    FlexLayoutModule,
    MatCheckboxModule,
    MatMomentDateModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonToggleModule,
    NgxMatSelectSearchModule,
    ShongoCalendarModule,
  ],
})
export class HomeModule {}
