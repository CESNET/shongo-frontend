import { Slot } from './slot.interface';

export interface Room {
  id: string;
  type: string;
  slot: Slot;
  earliestSlot: Slot;
  description: string;
  name: string;
  technology: string;
  state: string;
  isAvailable: boolean;
  isDeprecated: boolean;
  licenceCount: number;
  usageCount: number;
}
