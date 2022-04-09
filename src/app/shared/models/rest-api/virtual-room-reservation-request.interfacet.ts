export interface VirtualRoomReservationRequest {
  resource: string;
  description: string;
  roomName: string;
  timezone: string;
  adminPin?: string;
  userPin?: string;
  allowGuests?: boolean;
}
