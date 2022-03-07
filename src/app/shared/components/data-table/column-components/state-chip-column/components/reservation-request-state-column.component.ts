import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TableSettings } from '../../../filter/data-table-filter';
import resReqStateProps from '../../../models/maps/reservation-request-state-props.map';
import { SETTINGS_PROVIDER, VALUE_PROVIDER } from '../../column.component';
import { StateChipColumnComponent } from '../state-chip-column.component';

@Component({
  selector: 'app-reservation-request-state-column',
  templateUrl: '../state-chip-column.component.html',
})
export class ReservationRequestStateColumnComponent extends StateChipColumnComponent {
  statePropsMap = resReqStateProps;

  constructor(
    @Inject(VALUE_PROVIDER) value: string,
    @Inject(SETTINGS_PROVIDER) settings: Observable<TableSettings>
  ) {
    super(value, settings);
  }
}
