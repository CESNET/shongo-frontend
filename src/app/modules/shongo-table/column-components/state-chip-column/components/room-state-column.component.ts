import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomState } from 'src/app/shared/models/enums/room-state.enum';
import { TableSettings } from '../../../filter/data-table-filter';
import { ColumnData } from '../../../models/interfaces/column-data.interface';
import { COL_DATA_PROVIDER, SETTINGS_PROVIDER } from '../../column.component';
import {
  StateChipColumnComponent,
  StateProps,
} from '../state-chip-column.component';

@Component({
  selector: 'app-room-state-column',
  templateUrl: '../state-chip-column.component.html',
})
export class RoomStateColumnComponent<T> extends StateChipColumnComponent<T> {
  statePropsMap: Map<string, StateProps> = new Map([
    [
      RoomState.FAILED,
      { color: 'error', displayName: $localize`:room state:Error` },
    ],
    [
      RoomState.NOT_STARTED,
      { color: 'info', displayName: $localize`:room state:Unprepared` },
    ],
    [
      RoomState.STARTED,
      { color: 'success', displayName: $localize`:room state:Open` },
    ],
    [
      RoomState.STARTED_AVAILABLE,
      { color: 'success', displayName: $localize`:room state:Open` },
    ],
    [
      RoomState.STARTED_NOT_AVAILABLE,
      {
        color: 'ready',
        displayName: $localize`:room state:Prepared`,
      },
    ],
    [
      RoomState.STOPPED,
      {
        color: 'ready',
        displayName: $localize`:room state:Stopped`,
      },
    ],
  ]);

  constructor(
    @Inject(COL_DATA_PROVIDER) columnData: ColumnData<T>,
    @Inject(SETTINGS_PROVIDER) settings: Observable<TableSettings>
  ) {
    super(columnData, settings);
  }
}
