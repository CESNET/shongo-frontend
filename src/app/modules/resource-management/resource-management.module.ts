import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from '../material.module';
import { ResourceCapacityUtilizationPageComponent } from './pages/resource-capacity-utilization-page/resource-capacity-utilization-page.component';
import { PercentagePipe } from './pipes/percentage.pipe';
import { ResourceCapacityUtilizationFilterComponent } from './components/resource-capacity-utilization-filter/resource-capacity-utilization-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ResourceUtilizationColumnComponent } from './components/resource-utilization-column/resource-utilization-column.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ResourceUtilizationDetailPageComponent } from './pages/resource-utilization-detail-page/resource-utilization-detail-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  imports: [
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule,
    FlexLayoutModule,
    NgxSkeletonLoaderModule,
  ],
  declarations: [
    ResourceCapacityUtilizationPageComponent,
    PercentagePipe,
    ResourceCapacityUtilizationFilterComponent,
    ResourceUtilizationColumnComponent,
    ResourceUtilizationDetailPageComponent,
  ],
})
export class ResourceManagementModule {}
