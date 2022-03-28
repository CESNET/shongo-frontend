import { ResourceType } from '../enums/resource-type.enum';
import { Technology } from '../enums/technology.enum';

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  tag: string;
}

export interface PhysicalResource extends Resource {
  tag: string;
}

export interface VirtualRoomResource extends Resource {
  tag: Technology;
}
