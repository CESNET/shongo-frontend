import { User } from './user.interface';

export interface ResourceUtilizationDetail {
  id: string;
  name: string;
  intervalFrom: string;
  intervalTo: string;
  totalCapacity: number;
  usedCapacity: number;
  reservations: ResourceReservation[];
}

export interface ResourceReservationTableData {
  id: string;
  requestId: string;
  slotStart: string;
  slotEnd: string;
  licenceCount: number;
  owner: string;
}

export interface ResourceReservation {
  id: string;
  requestId: string;
  slot: {
    start: string;
    end: string;
  };
  licenceCount: number;
  user: User;
}

export interface ResourceOwner {
  name: string;
  id: string;
  email: string;
}
