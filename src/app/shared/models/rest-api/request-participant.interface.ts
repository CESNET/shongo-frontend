import { ParticipantRole } from '../enums/participant-role.enum';
import { ParticipantType } from '../enums/participant-type.enum';

export interface RequestParticipant {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: ParticipantRole;
  type: ParticipantType;
}

export interface UserParticipantPostBody {
  userId: string;
  role: ParticipantRole;
}

export interface GuestParticipantPostBody {
  name: string;
  email: string;
  role: ParticipantRole;
}
