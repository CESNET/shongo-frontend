import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReservationRequestStateColumnComponent } from './column-components/state-chip-column/components/reservation-request-state-column.component';
import { RoomStateColumnComponent } from './column-components/state-chip-column/components/room-state-column.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DesktopTableComponent } from './components/desktop-table/desktop-table.component';
import { MobileTableComponent } from './components/mobile-table/mobile-table.component';

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
