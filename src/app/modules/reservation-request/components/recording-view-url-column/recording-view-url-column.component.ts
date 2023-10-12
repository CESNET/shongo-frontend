import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ColumnComponent,
  COL_DATA_PROVIDER,
  SETTINGS_PROVIDER,
} from 'src/app/modules/shongo-table/column-components/column.component';
import { TableSettings } from 'src/app/modules/shongo-table/filter/data-table-filter';
import { ColumnData } from 'src/app/modules/shongo-table/models/interfaces/column-data.interface';
import { Recording } from 'src/app/shared/models/rest-api/recording';

@Component({
  selector: 'app-recording-view-url-column',
  templateUrl: './recording-view-url-column.component.html',
  styleUrls: ['./recording-view-url-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordingViewUrlColumnComponent extends ColumnComponent<Recording> {
  constructor(
    @Inject(COL_DATA_PROVIDER) public columnData: ColumnData<Recording>,
    @Inject(SETTINGS_PROVIDER) public settings: Observable<TableSettings>
  ) {
    super(columnData, settings);
  }

  get viewUrl(): string {
    return this.columnData.row.viewUrl || this.columnData.row.downloadUrl;
  }
}
