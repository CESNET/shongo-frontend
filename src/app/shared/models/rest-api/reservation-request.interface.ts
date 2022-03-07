import { ReservationRequestState } from 'src/app/models/enums/reservation-request-state.enum';
import { ReservationType } from 'src/app/models/enums/reservation-type.enum';
import { Days } from '../enums/days.enum';
import {
  MonthlyPeriodicityType,
  PeriodicityType,
} from '../enums/periodicity-type.enum';
import { ReservationRequestType } from '../enums/reservation-request-type.enum';
import { Slot } from './slot.interface';

export interface ReservationRequest {
  id: string;
  description: string;
  createdAt: string;
  state: ReservationRequestState;
  isWritable: boolean;
  isProvidable: boolean;
  ownerName: string;
  ownerEmail: string;
  slot: Slot;
  futureSlotCount: number;
  isDeprecated: boolean;
  type: ReservationType;
  virtualRoomData?: VirtualRoomData;
  physicalResourceData?: PhysicalResourceData;
  roomCapacityData?: RoomCapacityData;
}

export interface ReservationRequestDetail extends ReservationRequest {
  lastReservationId?: string;
  parentRequestId?: string;
  allocationState: string;
  executableState: string;
  notifyParticipants: boolean;
  periodicity: Periodicity;
  authorizedData: AuthorizedData;
  history: RequestModification[];
}

export interface VirtualRoomData {
  technology: string;
  roomName: string;
  roomParticipantCount: number;
  roomHasRecordingService: boolean;
  roomHasRecordings: boolean;
}

export interface PhysicalResourceData {
  resourceName: string;
  resourceDescription: string;
}

export interface RoomCapacityData {
  roomName: string;
  roomReservationRequestId: string;
  roomParticipantCount: number;
}

export interface Periodicity {
  type: PeriodicityType;
  monthlyPeriodicityType?: MonthlyPeriodicityType;
  periodicDayInMonth?: Days;
  periodicityDayOrder?: number;
  periodicityEnd?: string;
  periodicDaysInWeek?: Days[];
  periodicityCycle?: number;
  excludeDates?: string[];
}
export interface AuthorizedData {
  pin: string;
  adminPin: string;
  guestPin: string;
  allowGuests: boolean;
  aliases: Aliases;
}

export interface Aliases {
  'H323/SIP/PhoneNumber': string;
  'H.323 IP': string;
}

export interface ChildRequest {
  id: string;
  slot: Slot;
  state: string;
  aliases: Aliases;
}

export interface RequestModification {
  id: string;
  createdAt: string;
  createdBy: string;
  type: ReservationRequestType;
  allocationState: string;
  state: string;
  isActive: boolean;
  isLatestAllocated: boolean;
}
