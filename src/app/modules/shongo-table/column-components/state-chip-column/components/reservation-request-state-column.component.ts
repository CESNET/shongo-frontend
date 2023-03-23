import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TableSettings } from '../../../filter/data-table-filter';
import { ColumnData } from '../../../models/interfaces/column-data.interface';
import resReqStateProps from '../../../models/maps/reservation-request-state-props.map';
import { COL_DATA_PROVIDER, SETTINGS_PROVIDER } from '../../column.component';
import { StateChipColumnComponent } from '../state-chip-column.component';

@Component({
  selector: 'app-reservation-request-state-column',
  templateUrl: '../state-chip-column.component.html',
})
export class ReservationRequestStateColumnComponent<
  T
> extends StateChipColumnComponent<T> {
  statePropsMap = resReqStateProps;

  constructor(
    @Inject(COL_DATA_PROVIDER) columnData: ColumnData<T>,
    @Inject(SETTINGS_PROVIDER) settings: Observable<TableSettings>
  ) {
    super(columnData, settings);
  }
}
