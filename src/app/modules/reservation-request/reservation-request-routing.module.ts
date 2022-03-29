import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateParticipantPageComponent } from './pages/create-participant-page/create-participant-page.component';
import { CreateUserRolePageComponent } from './pages/create-user-role-page/create-user-role-page.component';
import { EditReservationRequestPageComponent } from './pages/edit-reservation-request-page/edit-reservation-request-page.component';
import { ReservationRequestDetailPageComponent } from './pages/reservation-request-detail-page/reservation-request-detail-page.component';

const routes: Routes = [
  { path: ':id', component: ReservationRequestDetailPageComponent },
  { path: ':id/edit', component: EditReservationRequestPageComponent },
  { path: ':id/user-role/create', component: CreateUserRolePageComponent },
  { path: ':id/participant/create', component: CreateParticipantPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationRequestRoutingModule {}
