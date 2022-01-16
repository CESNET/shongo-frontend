import { StateColor } from '../../../state-chip/state-chip.component';
import { ColumnComponent } from '../column.component';

export interface StateProps {
  displayName: string;
  color: StateColor;
}

export abstract class StateChipColumnComponent extends ColumnComponent {
  abstract statePropsMap: Record<string, StateProps>;

  constructor(value: string) {
    super(value);
  }

  getStateColor(state: string): StateColor {
    return this.statePropsMap[state].color;
  }

  getStateDisplayName(state: string): string {
    return this.statePropsMap[state].displayName;
  }
}
