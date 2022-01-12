import { ReservationRequest } from 'src/app/shared/models/rest-api/reservation-request.interface';

export const mockReservationRequest: ReservationRequest = {
  id: '1',
  technology: 'PEXIP',
  slotStart: '2021-11-04T15:30:00.000Z',
  slotEnd: '2021-11-04T16:30:00.000Z',
  adminPin: '1234',
  record: false,
  name: 'Testing room',
  author: '1',
  description: 'Testing room',
  state: 'CONFIRM_AWAITING',
  creationTime: '2021-11-03T18:38:09.546Z',
  notifyParticipants: false,
  participants: [
    {
      id: '1',
      name: 'Michal Drobňák',
      email: '493239@mail.muni.cz',
      role: 'OWNER',
    },
    {
      id: '2',
      name: 'Janko Hrasko',
      email: '493239@mail.muni.cz',
      role: 'PARTICIPANT',
    },
  ],
};
