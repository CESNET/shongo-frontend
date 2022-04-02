import { TeleconferenceReservationRequest } from 'src/app/shared/models/rest-api/teleconference-reservation-request.interface';
import { VideoconferenceReservationRequest } from 'src/app/shared/models/rest-api/videoconference-reservation-request.interface';
import { WebconferenceReservationRequest } from 'src/app/shared/models/rest-api/webconference-reservation-request.interface';
import { PhysicalResourceReservationRequest } from '../rest-api/physical-resource-reservation-request.interface';
import { VirtualRoomReservationRequest } from '../rest-api/virtual-room-reservation-request.interfacet';

export type ReservationRequestPostBody =
  | VideoconferenceReservationRequest
  | PhysicalResourceReservationRequest
  | WebconferenceReservationRequest
  | TeleconferenceReservationRequest
  | VirtualRoomReservationRequest;
