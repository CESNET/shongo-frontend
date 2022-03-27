export interface VideoconferenceReservationRequest {
  roomName: string;
  description: string;
  adminPin: string;
  participantCount: number;
  timezone: string;
  allowGuests: boolean;
  record: boolean;
}
