import { Slot } from './slot.interface';
import { User } from './user.interface';

export interface ResourceUtilizationDetail {
  id: string;
  name: string;
  interval: Slot;
  totalCapacity: number;
  usedCapacity: number;
  reservations: ResourceReservation[];
}

export interface ResourceReservation {
  id: string;
  requestId: string;
  slot: Slot;
  licenceCount: number;
  user: User;
}
