import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpPageComponent } from './modules/help/pages/help-page/help-page.component';
import { HomePageComponent } from './modules/home/pages/home-page/home-page.component';
import { ReservationRequestDetailPageComponent } from './modules/reservation-request/pages/reservation-request-detail/reservation-request-detail-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'reservation_request/:id',
    component: ReservationRequestDetailPageComponent,
  },
  { path: 'help', component: HelpPageComponent },
  {
    path: '**',
    component: HomePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
