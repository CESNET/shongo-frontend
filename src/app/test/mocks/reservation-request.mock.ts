import { ReservationRequestState } from 'src/app/models/enums/reservation-request-state.enum';
import { ReservationType } from 'src/app/models/enums/reservation-type.enum';
import { Days } from 'src/app/shared/models/enums/days.enum';
import { PeriodicityType } from 'src/app/shared/models/enums/periodicity-type.enum';
import { ReservationRequestType } from 'src/app/shared/models/enums/reservation-request-type.enum';
import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';

export const mockReservationRequest: ReservationRequestDetail = {
  id: 'shongo:meetings.cesnet.cz:req:1',
  description: 'A virtual room reservation.',
  createdAt: '2021-11-03T18:38:09.546Z',
  state: ReservationRequestState.FAILED,
  allocationState: 'FAILED',
  executableState: 'FAILED',
  isWritable: true,
  isProvidable: true,
  notifyParticipants: true,
  ownerName: 'Michal Drobnak',
  ownerEmail: '493239@muni.cz',
  slot: {
    start: '2021-11-04T15:30:00.000Z',
    end: '2021-11-04T16:30:00.000Z',
  },
  periodicity: {
    type: PeriodicityType.WEEKLY,
    periodicityEnd: '2021-11-04T15:30:00.000Z',
    periodicDaysInWeek: [Days.MONDAY, Days.TUESDAY],
    periodicityCycle: 1,
    excludeDates: ['2021-11-04'],
  },
  futureSlotCount: 5,
  isDeprecated: false,
  type: ReservationType.VIRTUAL_ROOM,
  virtualRoomData: {
    technology: 'PEXIP',
    roomName: 'Some room',
    roomParticipantCount: 5,
    roomHasRecordingService: true,
    roomHasRecordings: false,
  },
  authorizedData: {
    pin: '12345',
    adminPin: '56789',
    guestPin: '478',
    allowGuests: true,
    aliases: {
      'H323/SIP/PhoneNumber': '(00420)950087050',
      'H.323 IP': '78.128.216.82 050#',
    },
  },
  history: [
    {
      id: 'shongo:meetings.cesnet.cz:req:1',
      createdAt: '2021-11-03T18:38:09.546Z',
      createdBy: 'Michal Drobnak',
      type: ReservationRequestType.MODIFIED,
      allocationState: 'ERROR',
      state: 'ERROR',
      isActive: true,
      isLatestAllocated: false,
    },
    {
      id: 'shongo:meetings.cesnet.cz:req:5',
      createdAt: '2021-11-04T15:21:00.546Z',
      createdBy: 'Michal Drobnak',
      type: ReservationRequestType.NEW,
      allocationState: 'ERROR',
      state: 'ERROR',
      isActive: true,
      isLatestAllocated: true,
    },
  ],
};
