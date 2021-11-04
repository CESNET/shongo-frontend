export interface ReservationRequest {
  id: string;
  creationTime: string;
  slotStart: string;
  slotEnd: string;
  description: string;
  author: string;
  type: string;
  name: string;
  participants: number;
  technology: string;
  state: string;
  stateHelp: string;
}
