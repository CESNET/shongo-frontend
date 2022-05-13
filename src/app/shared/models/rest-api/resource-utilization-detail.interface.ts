import { Slot } from './slot.interface';
import { User } from './user.interface';

export interface ResourceUtilizationDetail {
  id: string;
  name: string;
  totalCapacity: number;
  usedCapacity: number;
  reservations: ResourceReservation[];
}

export interface ResourceReservation {
  id: string;
  requestId: string;
  slot: Slot;
  licenseCount: number;
  user: User;
}
