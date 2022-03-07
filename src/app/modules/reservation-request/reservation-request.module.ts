import { NgModule } from '@angular/core';
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
import { ReservationRequestRoutingModule } from './reservation-request-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReservationRequestRoutingModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    NgxMatSelectSearchModule,
    MatTabsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatProgressSpinnerModule,
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
