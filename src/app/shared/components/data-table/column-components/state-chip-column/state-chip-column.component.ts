import { Observable } from 'rxjs';
import { StateColor } from '../../../state-chip/state-chip.component';
import { TableSettings } from '../../filter/data-table-filter';
import { ColumnComponent } from '../column.component';

export interface StateProps {
  displayName: string;
  color: StateColor;
}

export abstract class StateChipColumnComponent extends ColumnComponent {
  abstract statePropsMap: Record<string, StateProps>;

  constructor(value: string, settings: Observable<TableSettings>) {
    super(value, settings);
  }

  getStateColor(state: string): StateColor {
    return this.statePropsMap[state].color;
  }

  getStateDisplayName(state: string): string {
    return this.statePropsMap[state].displayName;
  }
}
