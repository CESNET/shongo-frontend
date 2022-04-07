import {
  GuestParticipantPostBody,
  UserParticipantPostBody,
} from '../rest-api/request-participant.interface';

export type ParticipantPostBody =
  | UserParticipantPostBody
  | GuestParticipantPostBody;
