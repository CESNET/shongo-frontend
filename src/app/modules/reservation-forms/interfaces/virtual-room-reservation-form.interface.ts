import { ReservationForm } from './reservation-form.interface';

export interface VirtualRoomReservationForm extends ReservationForm {
  editingMode: boolean;
}
