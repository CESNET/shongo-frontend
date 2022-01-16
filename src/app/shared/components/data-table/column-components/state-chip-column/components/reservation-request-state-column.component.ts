import { Component, Inject } from '@angular/core';
import { ReservationRequestState } from 'src/app/models/enums/reservation-request-state.enum';
import { VALUE_PROVIDER } from '../../column.component';
import {
  StateChipColumnComponent,
  StateProps,
} from '../state-chip-column.component';

@Component({
  selector: 'app-reservation-request-state-column',
  templateUrl: '../state-chip-column.component.html',
})
export class ReservationRequestStateColumnComponent extends StateChipColumnComponent {
  statePropsMap: Record<string, StateProps> = {
    [ReservationRequestState.FAILED]: { color: 'error', displayName: 'Error' },
    [ReservationRequestState.DENIED]: { color: 'error', displayName: 'Error' },
    [ReservationRequestState.NOT_ALLOCATED]: {
      color: 'success',
      displayName: 'Created',
    },
    [ReservationRequestState.CONFIRM_AWAITING]: {
      color: 'success',
      displayName: 'Created',
    },
    [ReservationRequestState.ALLOCATED_STARTED_NOT_AVAILABLE]: {
      color: 'info',
      displayName: 'Prepared',
    },
    [ReservationRequestState.ALLOCATED_STARTED_AVAILABLE]: {
      color: 'success',
      displayName: 'Opened',
    },
    [ReservationRequestState.ALLOCATED_STARTED]: {
      color: 'success',
      displayName: 'Opened',
    },
    [ReservationRequestState.ALLOCATED_FINISHED]: {
      color: 'ready',
      displayName: 'Stopped',
    },
    [ReservationRequestState.ALLOCATED]: {
      color: 'success',
      displayName: 'Created',
    },
    [ReservationRequestState.MODIFICATION_FAILED]: {
      color: 'error',
      displayName: 'Modification failed',
    },
  };

  constructor(@Inject(VALUE_PROVIDER) value: string) {
    super(value);
  }
}
