import { Periodicity } from './reservation-request.interface';

export interface PhysicalResourceReservationRequest {
  description: string;
  timezone: string;
  periodicity: Periodicity;
}
