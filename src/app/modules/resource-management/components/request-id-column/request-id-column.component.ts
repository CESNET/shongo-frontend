import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ColumnComponent,
  COL_DATA_PROVIDER,
  SETTINGS_PROVIDER,
} from 'src/app/modules/shongo-table/column-components/column.component';
import { ResourceReservationTableData } from 'src/app/modules/shongo-table/data-sources/reservations.datasource';
import { TableSettings } from 'src/app/modules/shongo-table/filter/data-table-filter';
import { ColumnData } from 'src/app/modules/shongo-table/models/interfaces/column-data.interface';

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
