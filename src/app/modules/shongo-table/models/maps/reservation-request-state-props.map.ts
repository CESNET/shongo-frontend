import { ReservationRequestState } from 'src/app/shared/models/enums/reservation-request-state.enum';
import { StateProps } from '../../column-components/state-chip-column/state-chip-column.component';

export default new Map<ReservationRequestState, StateProps>([
  [
    ReservationRequestState.FAILED,
    { color: 'error', displayName: $localize`:state:Error` },
  ],
  [
    ReservationRequestState.DENIED,
    { color: 'error', displayName: $localize`:state:Error` },
  ],
  [
    ReservationRequestState.NOT_ALLOCATED,
    {
      color: 'success',
      displayName: $localize`:state:Created`,
    },
  ],
  [
    ReservationRequestState.CONFIRM_AWAITING,
    {
      color: 'success',
      displayName: $localize`:state:Created`,
    },
  ],
  [
    ReservationRequestState.ALLOCATED_STARTED_NOT_AVAILABLE,
    {
      color: 'info',
      displayName: $localize`:state:Prepared`,
    },
  ],
  [
    ReservationRequestState.ALLOCATED_STARTED_AVAILABLE,
    {
      color: 'success',
      displayName: $localize`:state:Open`,
    },
  ],
  [
    ReservationRequestState.ALLOCATED_STARTED,
    {
      color: 'success',
      displayName: $localize`:state:Open`,
    },
  ],
  [
    ReservationRequestState.ALLOCATED_FINISHED,
    {
      color: 'ready',
      displayName: $localize`:state:Stopped`,
    },
  ],
  [
    ReservationRequestState.ALLOCATED,
    {
      color: 'success',
      displayName: $localize`:state:Created`,
    },
  ],
  [
    ReservationRequestState.MODIFICATION_FAILED,
    {
      color: 'error',
      displayName: $localize`:state:Modification failed`,
    },
  ],
]);
