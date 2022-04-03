import { WebconferenceAccessMode } from 'src/app/shared/models/enums/webconference-access-mode.enum';
import { Periodicity } from 'src/app/shared/models/rest-api/reservation-request.interface';

export interface WebconferenceReservationRequest {
  roomName: string;
  description: string;
  userPin?: string;
  participantCount: number;
  timezone: string;
  accesMode: WebconferenceAccessMode;
  periodicity: Periodicity;
}
