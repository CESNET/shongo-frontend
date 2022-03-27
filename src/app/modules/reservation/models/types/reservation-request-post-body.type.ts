import { PhysicalResourceReservationRequest } from '../interfaces/physical-resource-reservation-request.interface';
import { TeleconferenceReservationRequest } from '../interfaces/teleconference-reservation-request.interface';
import { VideoconferenceReservationRequest } from '../interfaces/videoconference-reservation-request.interface';
import { WebconferenceReservationRequest } from '../interfaces/webconference-reservation-request.interface';

export type ReservationRequestPostBody =
  | VideoconferenceReservationRequest
  | PhysicalResourceReservationRequest
  | WebconferenceReservationRequest
  | TeleconferenceReservationRequest;
