import { VideoconferenceReservationRequest } from '../components/videoconference-reservation-form/videoconference-reservation-form.component';

export interface ReservationForm {
  valid: boolean;
  getFormValue(): VideoconferenceReservationRequest;
}
