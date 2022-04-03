import { RoomState } from 'src/app/shared/models/enums/room-state.enum';
import { AllocationState } from '../enums/allocation-state.enum';
import { Days } from '../enums/days.enum';
import { ExecutableState } from '../enums/executable-state.enum';
import {
  MonthlyPeriodicityType,
  PeriodicityType,
} from '../enums/periodicity-type.enum';
import { ReservationRequestState } from '../enums/reservation-request-state.enum';
import { ReservationRequestType } from '../enums/reservation-request-type.enum';
import { ReservationType } from '../enums/reservation-type.enum';
import { Technology } from '../enums/technology.enum';
import { Alias } from './alias.interface';
import { Slot } from './slot.interface';

export interface ReservationRequest {
  id: string;
  description: string;
  createdAt: string;
  parentRequestId?: string;
  lastReservationId?: string;
  state: ReservationRequestState;
  isWritable: boolean;
  isProvidable: boolean;
  ownerName: string;
  ownerEmail: string;
  slot: Slot;
  futureSlotCount?: number;
  isDeprecated: boolean;
  type: ReservationType;
  virtualRoomData?: VirtualRoomData;
  physicalResourceData?: PhysicalResourceData;
  roomCapacityData?: RoomCapacityData;
}

export interface ReservationRequestDetail extends ReservationRequest {
  allocationState: AllocationState;
  executableState: ExecutableState;
  notifyParticipants?: boolean;
  authorizedData?: AuthorizedData;
  history: RequestModification[];
}

export interface VirtualRoomData {
  roomResourceId: string;
  state: RoomState;
  technology: Technology;
  roomName: string;
  roomHasRecordings: boolean;
}

export interface PhysicalResourceData {
  resourceId: string;
  resourceName: string;
  resourceDescription: string;
  periodicity: Periodicity;
}

export interface RoomCapacityData {
  roomReservationRequestId: string;
  capacityParticipantCount: number;
  capacityHasRecordingService: boolean;
  capacityHasRecordings: boolean;
  isRecordingActive: boolean;
  periodicity: Periodicity;
}

export interface Periodicity {
  type: PeriodicityType;
  monthlyPeriodicityType?: MonthlyPeriodicityType;
  periodicDayInMonth?: Days;
  periodicityDayOrder?: number;
  periodicityEnd?: number;
  periodicDaysInWeek?: Days[];
  periodicityCycle?: number;
  excludeDates?: number[];
}
export interface AuthorizedData {
  pin: string;
  adminPin: string;
  userPin: string;
  allowGuests: boolean;
  aliases: Alias[];
}

export interface ChildRequest {
  id: string;
  slot: Slot;
  state: string;
  aliases: Alias[];
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
