import { Slot } from '../rest-api/slot.interface';
import { ReservationRequestPostBody } from './reservation-request-post-body.type';

export type EditReservationRequestBody = Omit<
  ReservationRequestPostBody,
  'timezone'
> & {
  slot: Slot;
};
