import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { ReservationRequestDetailPageComponent } from './pages/reservation-request-detail/reservation-request-detail-page.component';
import { ReservationDetailComponent } from './components/reservation-detail/reservation-detail.component';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  imports: [MaterialModule, CommonModule, NgxSkeletonLoaderModule],
  declarations: [
    ReservationRequestDetailPageComponent,
    ReservationDetailComponent,
  ],
})
export class ReservationRequestModule {}
