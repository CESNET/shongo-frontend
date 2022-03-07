import { ReservationRequestState } from 'src/app/models/enums/reservation-request-state.enum';
import { StateProps } from '../../column-components/state-chip-column/state-chip-column.component';

export default new Map<ReservationRequestState, StateProps>([
  [ReservationRequestState.FAILED, { color: 'error', displayName: 'Error' }],
  [ReservationRequestState.DENIED, { color: 'error', displayName: 'Error' }],
  [
    ReservationRequestState.NOT_ALLOCATED,
    {
      color: 'success',
      displayName: 'Created',
    },
  ],
  [
    ReservationRequestState.CONFIRM_AWAITING,
    {
      color: 'success',
      displayName: 'Created',
    },
  ],
  [
    ReservationRequestState.ALLOCATED_STARTED_NOT_AVAILABLE,
    {
      color: 'info',
      displayName: 'Prepared',
    },
  ],
  [
    ReservationRequestState.ALLOCATED_STARTED_AVAILABLE,
    {
      color: 'success',
      displayName: 'Opened',
    },
  ],
  [
    ReservationRequestState.ALLOCATED_STARTED,
    {
      color: 'success',
      displayName: 'Opened',
    },
  ],
  [
    ReservationRequestState.ALLOCATED_FINISHED,
    {
      color: 'ready',
      displayName: 'Stopped',
    },
  ],
  [
    ReservationRequestState.ALLOCATED,
    {
      color: 'success',
      displayName: 'Created',
    },
  ],
  [
    ReservationRequestState.MODIFICATION_FAILED,
    {
      color: 'error',
      displayName: 'Modification failed',
    },
  ],
]);
