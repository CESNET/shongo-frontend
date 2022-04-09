import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { ReservationRequestPostBody } from '../../../shared/models/types/reservation-request-post-body.type';

export interface ReservationForm {
  valid: boolean;
  editedRequest?: ReservationRequestDetail;

  getFormValue(): ReservationRequestPostBody;
  fill(reservationRequest: ReservationRequestDetail): void;
}
