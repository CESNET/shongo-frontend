import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ColumnComponent,
  COL_DATA_PROVIDER,
  SETTINGS_PROVIDER,
} from 'src/app/shared/components/data-table/column-components/column.component';
import { TableSettings } from 'src/app/shared/components/data-table/filter/data-table-filter';
import { ColumnData } from 'src/app/shared/components/data-table/models/interfaces/column-data.interface';
import { ResourceReservationTableData } from 'src/app/shared/models/rest-api/resource-utilization-detail.interface';

@Component({
  selector: 'app-request-id-column',
  templateUrl: './request-id-column.component.html',
  styleUrls: ['./request-id-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestIdColumnComponent extends ColumnComponent<ResourceReservationTableData> {
  constructor(
    @Inject(COL_DATA_PROVIDER)
    columnData: ColumnData<ResourceReservationTableData>,
    @Inject(SETTINGS_PROVIDER) settings: Observable<TableSettings>
  ) {
    super(columnData, settings);
  }
}
