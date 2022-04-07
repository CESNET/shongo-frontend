import { Observable } from 'rxjs';
import { StateColor } from '../../../state-chip/state-chip.component';
import { TableSettings } from '../../filter/data-table-filter';
import { ColumnData } from '../../models/interfaces/column-data.interface';
import { ColumnComponent } from '../column.component';

export interface StateProps {
  displayName: string;
  color: StateColor;
}

export abstract class StateChipColumnComponent<T> extends ColumnComponent<T> {
  abstract statePropsMap: Map<string, StateProps>;
  state: string;

  constructor(
    public columnData: ColumnData<T>,
    settings: Observable<TableSettings>
  ) {
    super(columnData, settings);
    this.state = String(columnData.row[columnData.columnName]);
  }

  getStateColor(state: string): StateColor {
    return this.statePropsMap.get(state)?.color ?? 'error';
  }

  getStateDisplayName(state: string): string {
    return (
      this.statePropsMap.get(state)?.displayName ??
      $localize`:fallback text:Unknown`
    );
  }
}
