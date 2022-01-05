import { FrontendReservationRequestState } from 'src/app/models/enums/frontend-reservation-request-state.enum';

export const tooltipMap: Record<FrontendReservationRequestState, string> = {
  [FrontendReservationRequestState.CREATED]:
    'The room has been successfully created, but the participants cannot join to it yet.',
  [FrontendReservationRequestState.ERROR]:
    'The room cannot be created. System administrator has been informed about the reason of failure.',
  [FrontendReservationRequestState.MODIFICATION_FAILED]:
    'The room cannot be modified. The original room was kept untouched.',
  [FrontendReservationRequestState.OPENED]:
    'The room has been successfully opened and the participants can join to it.',
  [FrontendReservationRequestState.PREPARED]:
    'The room has been successfully prepared, but currently no capacity is available. The participants cannot join to the room.',
  [FrontendReservationRequestState.STOPPED]:
    'The room has been stopped and thus the participants cannot join to it.',
};
