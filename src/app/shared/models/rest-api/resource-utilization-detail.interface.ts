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
  slotStart: string;
  slotEnd: string;
  licenceCount: number;
  owner: ResourceOwner;
}

export interface ResourceOwner {
  name: string;
  id: string;
  email: string;
}
