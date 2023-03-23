import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShongoTableModule } from '../shongo-table/shongo-table.module';
import { RequestIdColumnComponent } from './components/request-id-column/request-id-column.component';
import { ResourceCapacityUtilizationFilterComponent } from './components/resource-capacity-utilization-filter/resource-capacity-utilization-filter.component';
import { ResourceUtilizationColumnComponent } from './components/resource-utilization-column/resource-utilization-column.component';
import { ResourceCapacityUtilizationPageComponent } from './pages/resource-capacity-utilization-page/resource-capacity-utilization-page.component';
import { ResourceUtilizationDetailPageComponent } from './pages/resource-utilization-detail-page/resource-utilization-detail-page.component';
import { PercentagePipe } from './pipes/percentage.pipe';
import { ResourceManagementRoutingModule } from './resource-management-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ResourceManagementRoutingModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMomentDateModule,
    MatInputModule,
    MatSlideToggleModule,
    ShongoTableModule,
  ],
  declarations: [
    ResourceCapacityUtilizationPageComponent,
    PercentagePipe,
    ResourceCapacityUtilizationFilterComponent,
    ResourceUtilizationColumnComponent,
    ResourceUtilizationDetailPageComponent,
    RequestIdColumnComponent,
  ],
})
export class ResourceManagementModule {}
