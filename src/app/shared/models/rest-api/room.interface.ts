export interface Room {
  id: string;
  creationTime: string;
  slotStart: string;
  slotEnd: string;
  description: string;
  name: string;
  participants: number;
  technology: string;
  state: string;
}
