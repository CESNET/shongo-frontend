import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MaterialModule } from '../material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReservationCalendarComponent } from './components/reservation-calendar/reservation-calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [HomePageComponent, ReservationCalendarComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    MatButtonToggleModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
})
export class HomeModule {}
