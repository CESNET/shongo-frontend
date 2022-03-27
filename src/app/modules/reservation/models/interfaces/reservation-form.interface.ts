import { ReservationRequestPostBody } from '../types/reservation-request-post-body.type';

export interface ReservationForm {
  valid: boolean;
  getFormValue(): ReservationRequestPostBody;
}
