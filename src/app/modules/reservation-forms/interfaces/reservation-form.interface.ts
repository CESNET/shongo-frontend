import { ReservationRequestPostBody } from '../../reservation/models/types/reservation-request-post-body.type';

export interface ReservationForm {
  valid: boolean;
  getFormValue(): ReservationRequestPostBody;
}
