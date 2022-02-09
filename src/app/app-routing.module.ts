import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpPageComponent } from './modules/help/pages/help-page/help-page.component';
import { ReportPageComponent } from './modules/help/pages/report-page/report-page.component';
import { UserSettingsPageComponent } from './modules/help/pages/user-settings-page/user-settings-page.component';
import { HomePageComponent } from './modules/home/pages/home-page/home-page.component';
import { ReservationRequestDetailPageComponent } from './modules/reservation-request/pages/reservation-request-detail/reservation-request-detail-page.component';
import { ReservationPageComponent } from './modules/reservation/pages/reservation-page/reservation-page.component';
import { ResourceCapacityUtilizationPageComponent } from './modules/resource-management/pages/resource-capacity-utilization-page/resource-capacity-utilization-page.component';
import { ResourceUtilizationDetailPageComponent } from './modules/resource-management/pages/resource-utilization-detail-page/resource-utilization-detail-page.component';

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
  { path: 'report', component: ReportPageComponent },
  { path: 'user/settings', component: UserSettingsPageComponent },
  {
    path: 'resource-management/capacity-utilization',
    component: ResourceCapacityUtilizationPageComponent,
  },
  {
    path: 'resource-management/capacity-utilization/detail',
    component: ResourceUtilizationDetailPageComponent,
  },
  {
    path: 'reserve',
    component: ReservationPageComponent,
  },
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
