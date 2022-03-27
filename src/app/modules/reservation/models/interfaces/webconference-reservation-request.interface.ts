import { WebconferenceAccessMode } from 'src/app/shared/models/enums/webconference-access-mode.enum';

export interface WebconferenceReservationRequest {
  roomName: string;
  description: string;
  userPin: string;
  participantCount: number;
  timezone: string;
  accesMode: WebconferenceAccessMode;
}
