import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  ColumnComponent,
  VALUE_PROVIDER,
} from '../../../../shared/components/data-table/column-components/column.component';
import { FrontendReservationRequestState } from 'src/app/models/enums/frontend-reservation-request-state.enum';
import { stateMap } from './state-map';
import { tooltipMap } from './tooltip-map';
import { ReservationRequestState } from 'src/app/models/enums/reservation-request-state.enum';

@Component({
  selector: 'app-room-state-column',
  templateUrl: './room-state-column.component.html',
  styleUrls: ['./room-state-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomStateColumnComponent extends ColumnComponent {
  state: FrontendReservationRequestState;
  tooltipMap = tooltipMap;

  constructor(@Inject(VALUE_PROVIDER) value: ReservationRequestState) {
    super(value);
    this.state = stateMap[value];
  }
}
