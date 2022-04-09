import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ReservationRequestStateColumnComponent } from './column-components/state-chip-column/components/reservation-request-state-column.component';
import { RoomStateColumnComponent } from './column-components/state-chip-column/components/room-state-column.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DesktopTableComponent } from './components/desktop-table/desktop-table.component';
import { MobileTableComponent } from './components/mobile-table/mobile-table.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    DataTableComponent,
    ReservationRequestStateColumnComponent,
    RoomStateColumnComponent,
    DesktopTableComponent,
    MobileTableComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDividerModule,
    SharedModule,
    MatButtonModule,
    MatCardModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [
    DataTableComponent,
    ReservationRequestStateColumnComponent,
    RoomStateColumnComponent,
  ],
})
export class ShongoTableModule {}
