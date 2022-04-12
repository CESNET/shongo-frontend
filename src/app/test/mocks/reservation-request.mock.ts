import { AliasType } from 'src/app/shared/models/enums/alias-type.enum';
import { AllocationState } from 'src/app/shared/models/enums/allocation-state.enum';
import { ExecutableState } from 'src/app/shared/models/enums/executable-state.enum';
import { ReservationRequestState } from 'src/app/shared/models/enums/reservation-request-state.enum';
import { ReservationRequestType } from 'src/app/shared/models/enums/reservation-request-type.enum';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
import { RoomState } from 'src/app/shared/models/enums/room-state.enum';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { ReservationRequestDetail } from 'src/app/shared/models/rest-api/reservation-request.interface';

export const mockReservationRequest: ReservationRequestDetail = {
  id: 'shongo:meetings.cesnet.cz:req:1',
  description: 'A virtual room reservation.',
  createdAt: '2021-11-03T18:38:09.546Z',
  state: ReservationRequestState.FAILED,
  allocationState: AllocationState.NOT_ALLOCATED,
  executableState: ExecutableState.NOT_STARTED,
  isWritable: true,
  isProvidable: true,
  notifyParticipants: true,
  ownerName: 'Michal Drobnak',
  ownerEmail: '493239@muni.cz',
  slot: {
    start: '2021-11-04T15:30:00.000Z',
    end: '2021-11-04T16:30:00.000Z',
  },
  futureSlotCount: 5,
  isDeprecated: false,
  type: ReservationType.VIRTUAL_ROOM,
  virtualRoomData: {
    roomResourceId: 'shongo:meetings.cesnet.cz:res:1',
    state: RoomState.FAILED,
    technology: Technology.PEXIP,
    roomName: 'Some room',
    roomHasRecordings: true,
  },
  authorizedData: {
    pin: '12345',
    adminPin: '56789',
    userPin: '478',
    allowGuests: true,
    aliases: [
      {
        type: AliasType.ADOBE_CONNECT_URI,
        value: 'https://adobe.connect.com/asd4559a498w49df5',
      },
    ],
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
