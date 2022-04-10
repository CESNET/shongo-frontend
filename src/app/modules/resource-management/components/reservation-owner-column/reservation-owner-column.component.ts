import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ColumnComponent,
  COL_DATA_PROVIDER,
  SETTINGS_PROVIDER,
} from 'src/app/modules/shongo-table/column-components/column.component';
import { TableSettings } from 'src/app/modules/shongo-table/filter/data-table-filter';
import { ColumnData } from 'src/app/modules/shongo-table/models/interfaces/column-data.interface';

import {
  ResourceOwner,
  ResourceReservationTableData,
} from 'src/app/shared/models/rest-api/resource-utilization-detail.interface';

@Component({
  selector: 'app-reservation-owner-column',
  templateUrl: './reservation-owner-column.component.html',
  styleUrls: ['./reservation-owner-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationOwnerColumnComponent extends ColumnComponent<ResourceReservationTableData> {
  owner: ResourceOwner;

  constructor(
    @Inject(COL_DATA_PROVIDER)
    columnData: ColumnData<ResourceReservationTableData>,
    @Inject(SETTINGS_PROVIDER) settings: Observable<TableSettings>
  ) {
    super(columnData, settings);
    this.owner = JSON.parse(columnData.row.owner);
  }
}
