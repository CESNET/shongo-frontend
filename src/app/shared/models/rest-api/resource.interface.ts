import { ResourceType } from '../enums/resource-type.enum';
import { Technology } from '../enums/technology.enum';

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  description: string;
  hasCapacity: boolean;
  tags?: string[];
  technology?: Technology;
}

export interface PhysicalResource extends Resource {
  tags: string[];
}

export interface VirtualRoomResource extends Resource {
  technology: Technology;
}
