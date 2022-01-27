import { DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ResourceCapacityUtilizationService } from 'src/app/core/http/resource-capacity-utilization/resource-capacity-utilization.service';
import { ResourceCapacityUtilizationDataSource } from 'src/app/shared/components/data-table/data-sources/resource-capacity-utilization-datasource';

@Component({
  selector: 'app-resource-capacity-utilization-page',
  templateUrl: './resource-capacity-utilization-page.component.html',
  styleUrls: ['./resource-capacity-utilization-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceCapacityUtilizationPageComponent {
  dataSource: ResourceCapacityUtilizationDataSource;

  constructor(
    private _resouceCapacityUtilizationService: ResourceCapacityUtilizationService,
    private _datePipe: DatePipe
  ) {
    this.dataSource = new ResourceCapacityUtilizationDataSource(
      this._resouceCapacityUtilizationService,
      this._datePipe
    );
  }
}
