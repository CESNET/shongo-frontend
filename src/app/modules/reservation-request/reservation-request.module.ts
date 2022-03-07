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
import { CreateUserRolePageComponent } from './pages/create-user-role-page/create-user-role-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ParticipantsTabComponent } from './components/participants-tab/participants-tab.component';
import { CreateParticipantPageComponent } from './pages/create-participant-page/create-participant-page.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    NgxSkeletonLoaderModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
  ],
  declarations: [
    ReservationRequestDetailPageComponent,
    ReservationDetailComponent,
    CapacityReservationsTabComponent,
    UserRolesTabComponent,
    CreateUserRolePageComponent,
    ParticipantsTabComponent,
    CreateParticipantPageComponent,
  ],
})
export class ReservationRequestModule {}
