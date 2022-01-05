import { FrontendReservationRequestState } from 'src/app/models/enums/frontend-reservation-request-state.enum';
import { ReservationRequestState } from 'src/app/models/enums/reservation-request-state.enum';

export const stateMap: Record<
  ReservationRequestState,
  FrontendReservationRequestState
> = {
  [ReservationRequestState.FAILED]: FrontendReservationRequestState.ERROR,
  [ReservationRequestState.DENIED]: FrontendReservationRequestState.ERROR,
  [ReservationRequestState.NOT_ALLOCATED]:
    FrontendReservationRequestState.CREATED,
  [ReservationRequestState.CONFIRM_AWAITING]:
    FrontendReservationRequestState.CREATED,
  [ReservationRequestState.ALLOCATED_STARTED_NOT_AVAILABLE]:
    FrontendReservationRequestState.PREPARED,
  [ReservationRequestState.ALLOCATED_STARTED_AVAILABLE]:
    FrontendReservationRequestState.OPENED,
  [ReservationRequestState.ALLOCATED_STARTED]:
    FrontendReservationRequestState.OPENED,
  [ReservationRequestState.ALLOCATED_FINISHED]:
    FrontendReservationRequestState.STOPPED,
  [ReservationRequestState.ALLOCATED]: FrontendReservationRequestState.CREATED,
  [ReservationRequestState.MODIFICATION_FAILED]:
    FrontendReservationRequestState.MODIFICATION_FAILED,
};
