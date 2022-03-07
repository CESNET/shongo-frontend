import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpPageComponent } from './pages/help-page/help-page.component';
import { ReportPageComponent } from './pages/report-page/report-page.component';

const routes: Routes = [
  { path: '', component: HelpPageComponent },
  { path: 'report', component: ReportPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpRoutingModule {}
