import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../modules/material.module';
import { DataTableComponent } from './components/data-table/data-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [DataTableComponent],
  imports: [
    CommonModule,
    MaterialModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [DatePipe],
  exports: [DataTableComponent],
})
export class SharedModule {}
