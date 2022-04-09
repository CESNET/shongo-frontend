import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ResourceCapacityUtilizationDataSource } from 'src/app/modules/shongo-table/data-sources/resource-capacity-utilization-datasource';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';

@Component({
  selector: 'app-resource-capacity-utilization-page',
  templateUrl: './resource-capacity-utilization-page.component.html',
  styleUrls: ['./resource-capacity-utilization-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceCapacityUtilizationPageComponent {
  dataSource: ResourceCapacityUtilizationDataSource;

  constructor(
    private _resourceService: ResourceService,
    private _datePipe: MomentDatePipe
  ) {
    this.dataSource = new ResourceCapacityUtilizationDataSource(
      this._resourceService,
      this._datePipe
    );
  }
}
