import { User } from './user.interface';

export interface RoomParticipant extends User {
  role: string;
}
