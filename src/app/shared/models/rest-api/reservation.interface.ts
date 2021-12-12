export interface Reservation {
  id: string;
  meetingRoom: string;
  owner: string;
  ownerEmail: string;
  slotStart: string;
  slotEnd: string;
  description: string;
}
