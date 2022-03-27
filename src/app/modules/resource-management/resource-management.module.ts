import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResourceCapacityUtilizationPageComponent } from './pages/resource-capacity-utilization-page/resource-capacity-utilization-page.component';
import { PercentagePipe } from './pipes/percentage.pipe';
import { ResourceCapacityUtilizationFilterComponent } from './components/resource-capacity-utilization-filter/resource-capacity-utilization-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ResourceUtilizationColumnComponent } from './components/resource-utilization-column/resource-utilization-column.component';
import { ResourceUtilizationDetailPageComponent } from './pages/resource-utilization-detail-page/resource-utilization-detail-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RouterModule } from '@angular/router';
import { ResourceManagementRoutingModule } from './resource-management-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ResourceManagementRoutingModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxSkeletonLoaderModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMomentDateModule,
    MatInputModule,
    MatSlideToggleModule,
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
