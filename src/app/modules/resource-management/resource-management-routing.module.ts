import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceCapacityUtilizationPageComponent } from './pages/resource-capacity-utilization-page/resource-capacity-utilization-page.component';
import { ResourceUtilizationDetailPageComponent } from './pages/resource-utilization-detail-page/resource-utilization-detail-page.component';

const routes: Routes = [
  {
    path: 'capacity-utilization',
    component: ResourceCapacityUtilizationPageComponent,
  },
  {
    path: 'capacity-utilization/detail',
    component: ResourceUtilizationDetailPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceManagementRoutingModule {}
