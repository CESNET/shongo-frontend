import { ResourceType } from '../enums/resource-type.enum';

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
}
