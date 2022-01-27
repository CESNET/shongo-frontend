import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomState } from 'src/app/models/enums/room-state.enum';
import { TableSettings } from '../../../filter/data-table-filter';
import { SETTINGS_PROVIDER, VALUE_PROVIDER } from '../../column.component';
import {
  StateChipColumnComponent,
  StateProps,
} from '../state-chip-column.component';

@Component({
  selector: 'app-room-state-column',
  templateUrl: '../state-chip-column.component.html',
})
export class RoomStateColumnComponent extends StateChipColumnComponent {
  statePropsMap: Record<string, StateProps> = {
    [RoomState.FAILED]: { color: 'error', displayName: 'Error' },
    [RoomState.NOT_STARTED]: { color: 'info', displayName: 'Unprepared' },
    [RoomState.STARTED]: { color: 'success', displayName: 'Opened' },
    [RoomState.STARTED_AVAILABLE]: { color: 'success', displayName: 'Opened' },
    [RoomState.STARTED_NOT_AVAILABLE]: {
      color: 'success',
      displayName: 'Prepared',
    },
    [RoomState.STOPPED]: {
      color: 'success',
      displayName: 'Stopped',
    },
  };

  constructor(
    @Inject(VALUE_PROVIDER) value: string,
    @Inject(SETTINGS_PROVIDER) settings: Observable<TableSettings>
  ) {
    super(value, settings);
  }
}
