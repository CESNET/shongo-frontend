import { ParticipantRole } from '../enums/participant-role.enum';
import { RoomLayout } from '../enums/room-layout.enum';

export interface RuntimeParticipant {
  id: number;
  name: string;
  displayName: string;
  role: ParticipantRole;
  email: string;
  layout: RoomLayout;
  microphoneEnabled: boolean;
  microphoneLevel: number;
  videoEnabled: boolean;
  videoSnapshot: boolean;
}
