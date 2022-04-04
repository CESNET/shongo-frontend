import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarViewSelectionComponent } from './components/calendar-view-selection/calendar-view-selection.component';
import { MatMenuModule } from '@angular/material/menu';
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarMomentDateFormatter,
  DateAdapter,
  MOMENT,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReservationCalendarComponent } from './components/reservation-calendar/reservation-calendar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CalendarPaginatorComponent } from './components/calendar-paginator/calendar-paginator.component';

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

@NgModule({
  declarations: [
    CalendarViewSelectionComponent,
    ReservationCalendarComponent,
    CalendarPaginatorComponent,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CalendarModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: momentAdapterFactory,
      },
      {
        dateFormatter: {
          provide: CalendarDateFormatter,
          useClass: CalendarMomentDateFormatter,
        },
      }
    ),
  ],
  providers: [
    {
      provide: MOMENT,
      useValue: moment,
    },
  ],
  exports: [
    CalendarViewSelectionComponent,
    ReservationCalendarComponent,
    CalendarPaginatorComponent,
    CalendarModule,
  ],
})
export class ShongoCalendarModule {}
