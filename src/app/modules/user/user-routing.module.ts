import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSettingsPageComponent } from './pages/user-settings-page/user-settings-page.component';

const routes: Routes = [
  { path: 'settings', component: UserSettingsPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
