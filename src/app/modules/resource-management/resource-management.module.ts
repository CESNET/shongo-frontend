import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from '../material.module';
import { ResourceCapacityUtilizationPageComponent } from './pages/resource-capacity-utilization-page/resource-capacity-utilization-page.component';
import { PercentageColumnComponent } from './components/percentage-column/percentage-column.component';
import { PercentagePipe } from './pipes/percentage.pipe';
import { ResourceCapacityUtilizationFilterComponent } from './components/resource-capacity-utilization-filter/resource-capacity-utilization-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [SharedModule, MaterialModule, ReactiveFormsModule, CommonModule],
  declarations: [
    ResourceCapacityUtilizationPageComponent,
    PercentageColumnComponent,
    PercentagePipe,
    ResourceCapacityUtilizationFilterComponent,
  ],
})
export class ResourceManagementModule {}
