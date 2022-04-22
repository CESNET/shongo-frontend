import { IdentityType } from '../enums/identity-type.enum';
import { ParticipantRole } from '../enums/participant-role.enum';
import { ParticipantType } from '../enums/participant-type.enum';
import { RoleType } from '../enums/role-type.enum';

export interface RequestParticipant {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: ParticipantRole;
  type: ParticipantType;
}

export interface UserParticipantPostBody extends ParticipantPostBody {
  userId: string;
}

export interface GuestParticipantPostBody extends ParticipantPostBody {
  name: string;
  email: string;
}

export interface ParticipantPostBody {
  type: ParticipantType;
  role: ParticipantRole;
}

export interface RoleBody {
  type: IdentityType;
  entityId: string;
  role: RoleType;
}
