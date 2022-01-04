import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../modules/material.module';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DatePipe } from '@angular/common';
import { MatTableResponsiveDirective } from './directives/mat-table-responsive/mat-table-responsive.directive';
import { ShortStringPipe } from './pipes/short-string.pipe';
import { ReservationRequestFilterComponent } from './components/data-table/filter/reservation-request-filter/reservation-request-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CertainityCheckComponent } from './components/certainity-check/certainity-check.component';

@NgModule({
  declarations: [
    DataTableComponent,
    MatTableResponsiveDirective,
    ShortStringPipe,
    ReservationRequestFilterComponent,
    CertainityCheckComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [DatePipe],
  exports: [
    DataTableComponent,
    ShortStringPipe,
    ReservationRequestFilterComponent,
    CertainityCheckComponent,
  ],
})
export class SharedModule {}
