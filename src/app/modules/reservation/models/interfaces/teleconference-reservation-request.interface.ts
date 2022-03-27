export interface TeleconferenceReservationRequest {
  description: string;
  roomName: string;
  timezone: string;
  adminPin: string;
  userPin: string;
}
