import { RoomParticipant } from './room-participant.interface';

export interface ReservationRequest {
  id: string;
  creationTime: string;
  slotStart: string;
  slotEnd: string;
  description: string;
  author: string;
  name: string;
  participants: RoomParticipant[];
  technology: string;
  state: string;
  record: boolean;
  notifyParticipants: boolean;
  adminPin?: string;
}
