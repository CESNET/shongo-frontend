import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../modules/material.module';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DatePipe } from '@angular/common';
import { MatTableResponsiveDirective } from './directives/mat-table-responsive/mat-table-responsive.directive';
import { ShortStringPipe } from './pipes/short-string.pipe';
import { ReservationRequestFilterComponent } from './components/data-table/filter/reservation-request-filter/reservation-request-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DataTableComponent,
    MatTableResponsiveDirective,
    ShortStringPipe,
    ReservationRequestFilterComponent,
  ],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  providers: [DatePipe],
  exports: [
    DataTableComponent,
    ShortStringPipe,
    ReservationRequestFilterComponent,
  ],
})
export class SharedModule {}
