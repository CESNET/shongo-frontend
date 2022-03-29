import { Periodicity } from 'src/app/shared/models/rest-api/reservation-request.interface';

export interface VideoconferenceReservationRequest {
  roomName: string;
  description: string;
  adminPin?: string;
  participantCount: number;
  timezone: string;
  allowGuests: boolean;
  record: boolean;
  periodicity: Periodicity;
}
