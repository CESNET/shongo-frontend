import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ColumnComponent,
  COL_DATA_PROVIDER,
  SETTINGS_PROVIDER,
} from 'src/app/shared/components/data-table/column-components/column.component';
import { TableSettings } from 'src/app/shared/components/data-table/filter/data-table-filter';
import { ColumnData } from 'src/app/shared/components/data-table/models/interfaces/column-data.interface';
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
}
