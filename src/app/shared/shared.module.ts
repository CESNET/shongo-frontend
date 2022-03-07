import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../modules/material.module';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DatePipe } from '@angular/common';
import { MatTableResponsiveDirective } from './directives/mat-table-responsive/mat-table-responsive.directive';
import { ShortStringPipe } from './pipes/short-string.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CertainityCheckComponent } from './components/certainity-check/certainity-check.component';
import { StateChipComponent } from './components/state-chip/state-chip.component';
import { ReservationRequestStateColumnComponent } from './components/data-table/column-components/state-chip-column/components/reservation-request-state-column.component';
import { RoomStateColumnComponent } from './components/data-table/column-components/state-chip-column/components/room-state-column.component';
import { ReservationCalendarComponent } from './components/reservation-calendar/reservation-calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AlertComponent } from './components/alert/alert.component';

@NgModule({
  declarations: [
    DataTableComponent,
    MatTableResponsiveDirective,
    ShortStringPipe,
    CertainityCheckComponent,
    StateChipComponent,
    ReservationRequestStateColumnComponent,
    RoomStateColumnComponent,
    ReservationCalendarComponent,
    AlertComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxMatSelectSearchModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [DatePipe],
  exports: [
    DataTableComponent,
    ShortStringPipe,
    CertainityCheckComponent,
    ReservationCalendarComponent,
    StateChipComponent,
    AlertComponent,
  ],
})
export class SharedModule {}
