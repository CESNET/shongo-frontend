import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CalendarModule } from 'angular-calendar';
import { CalendarPaginatorComponent } from './components/calendar-paginator/calendar-paginator.component';
import { CalendarViewSelectionComponent } from './components/calendar-view-selection/calendar-view-selection.component';

@NgModule({
  declarations: [CalendarViewSelectionComponent, CalendarPaginatorComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    LayoutModule,
    CalendarModule,
  ],
  exports: [CalendarViewSelectionComponent, CalendarPaginatorComponent],
})
export class CalendarHelperModule {}
