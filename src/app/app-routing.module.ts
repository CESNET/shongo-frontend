import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from './core/guards/is-admin.guard';
import { IsAuthGuard } from './core/guards/is-auth.guard';
import { UnauthorizedPageComponent } from './core/components/unauthorized-page/unauthorized-page.component';
import { HomePageComponent } from './modules/home/pages/home-page/home-page.component';
import { MainLayoutComponent } from './core/components/main-layout/main-layout.component';
import { CanReserveGuard } from './core/guards/can-reserve.guard';

const routes: Routes = [
  {
    path: 'reserve',
    loadChildren: () =>
      import('./modules/reservation/reservation.module').then(
        (m) => m.ReservationModule
      ),
    canLoad: [IsAuthGuard, CanReserveGuard],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: 'reservation-request',
        loadChildren: () =>
          import(
            './modules/reservation-request/reservation-request.module'
          ).then((m) => m.ReservationRequestModule),
        canLoad: [IsAuthGuard],
      },
      {
        path: 'help',
        loadChildren: () =>
          import('./modules/help/help.module').then((m) => m.HelpModule),
      },
      {
        path: 'resource-management',
        loadChildren: () =>
          import(
            './modules/resource-management/resource-management.module'
          ).then((m) => m.ResourceManagementModule),
        canLoad: [IsAuthGuard, IsAdminGuard],
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./modules/user/user.module').then((m) => m.UserModule),
        canLoad: [IsAuthGuard],
      },
      {
        path: 'unauthorized',
        component: UnauthorizedPageComponent,
      },
      {
        path: '**',
        component: HomePageComponent,
      },
    ],
  },
  { path: '**', redirectTo: '/app', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
