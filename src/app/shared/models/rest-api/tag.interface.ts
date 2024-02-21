import { TagType } from '../enums/tag-type.enum';

export type Tag = DefaultTag | ReservationDataTag | NotifyEmailTag;

interface TagBase {
  id: string;
  name: string;
  type: TagType;
}

export interface DefaultTag extends TagBase {
  type: TagType.DEFAULT;
  data: unknown;
}

export interface ReservationDataTag extends TagBase {
  type: TagType.RESERVATION_DATA;
  data: unknown;
}

export interface NotifyEmailTag extends TagBase {
  type: TagType.NOTIFY_EMAIL;
  data: string[];
}
