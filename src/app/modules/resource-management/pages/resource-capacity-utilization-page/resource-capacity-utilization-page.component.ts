import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';
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

  async ngOnInit(): Promise<void> {
    await this._initializeTable();
    this._cd.detectChanges();
  }

  /**
   * Creates data source with columns depending on available resources.
   */
  private async _initializeTable(): Promise<void> {
    const resourceNames = await this._fetchResourceNames().catch(() => {
      this.error = true;
      return [];
    });

    if (!resourceNames || resourceNames.length === 0) {
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
   * Fetches capacity utilization and extracts resource names.
   *
   * @returns Promise with resource names.
   */
  private async _fetchResourceNames(): Promise<string[]> {
    return lastValueFrom(
      this._resourceService.fetchCapacityUtilization(1, 0)
    ).then(
      (capacityUtilization) =>
        capacityUtilization?.items[0]?.resources.map((res) => res.name) ?? []
    );
  }
}
