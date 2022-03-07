import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './modules/home/pages/home-page/home-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'reservation-request',
    loadChildren: () =>
      import('./modules/reservation-request/reservation-request.module').then(
        (m) => m.ReservationRequestModule
      ),
  },
  {
    path: 'help',
    loadChildren: () =>
      import('./modules/help/help.module').then((m) => m.HelpModule),
  },
  {
    path: 'resource-management',
    loadChildren: () =>
      import('./modules/resource-management/resource-management.module').then(
        (m) => m.ResourceManagementModule
      ),
  },
  {
    path: 'reserve',
    loadChildren: () =>
      import('./modules/reservation/reservation.module').then(
        (m) => m.ReservationModule
      ),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
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
