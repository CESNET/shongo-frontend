import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { ReservationRequestDetailPageComponent } from './pages/reservation-request-detail/reservation-request-detail-page.component';
import { ReservationDetailComponent } from './components/reservation-detail/reservation-detail.component';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CapacityReservationsTabComponent } from './components/capacity-reservations-tab/capacity-reservations-tab.component';
import { UserRolesTabComponent } from './components/user-roles-tab/user-roles-tab.component';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    NgxSkeletonLoaderModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [
    ReservationRequestDetailPageComponent,
    ReservationDetailComponent,
    CapacityReservationsTabComponent,
    UserRolesTabComponent,
  ],
})
export class ReservationRequestModule {}
