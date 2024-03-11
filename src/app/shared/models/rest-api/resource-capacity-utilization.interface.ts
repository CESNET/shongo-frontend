import { EResourceUtilizationType } from '../enums/resource-utilization-type.enum';
import { Slot } from './slot.interface';

export interface ResourceCapacityUtilization {
  interval: Slot;
  resources: Resource[];
}

export interface Resource {
  id: string;
  name: string;
  totalCapacity: number;
  usedCapacity: number;
  type: EResourceUtilizationType;
}
