import { ResourceType } from '../enums/resource-type.enum';
import { Technology } from '../enums/technology.enum';
import { Tag } from './tag.interface';

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  description: string;
  hasCapacity: boolean;
  tags?: Tag[];
  technology?: Technology;
}

export interface PhysicalResource extends Resource {
  tags: Tag[];
}

export interface VirtualRoomResource extends Resource {
  technology: Technology;
}
