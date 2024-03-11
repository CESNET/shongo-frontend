import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ResourceCapacityUtilizationDataSource } from 'src/app/modules/shongo-table/data-sources/resource-capacity-utilization-datasource';
import { AlertType } from 'src/app/shared/models/enums/alert-type.enum';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';

@Component({
  selector: 'app-resource-capacity-utilization-page',
  templateUrl: './resource-capacity-utilization-page.component.html',
  styleUrls: ['./resource-capacity-utilization-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceCapacityUtilizationPageComponent implements OnInit {
  dataSource?: ResourceCapacityUtilizationDataSource;
  noResources = false;
  error = false;

  readonly AlertType = AlertType;

  constructor(
    private _resourceService: ResourceService,
    private _datePipe: MomentDatePipe,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    void this._resourceService
      .fetchResources()
      .then(() => this._initializeTable())
      .then(() => this._cd.detectChanges());
  }

  /**
   * Creates data source with columns depending on available resources.
   */
  private async _initializeTable(): Promise<void> {
    const resourceNames = this._getResourceNames();

    if (!resourceNames || !resourceNames.length) {
      this.noResources = true;
    } else {
      this.dataSource = new ResourceCapacityUtilizationDataSource(
        this._resourceService,
        this._datePipe,
        resourceNames
      );
    }
  }

  /**
   * Returns names of resources that have a capacity..
   *
   * @returns Array of resource names.
   */
  private _getResourceNames(): string[] {
    return this._resourceService
      .getResourcesWithCapacity()
      .map((res) => res.name);
  }
}
