export interface MeetingRoomInterface {
  id: string;
  meeting_room: string;
  reserved_by: string;
  slot_start: string;
  slot_end: string;
  state: string;
  description: string;
}
