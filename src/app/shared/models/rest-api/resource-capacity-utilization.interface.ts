export interface ResourceCapacityUtilization {
  intervalFrom: string;
  intervalTo: string;
  resources: Resource[];
}

export interface Resource {
  id: string;
  name: string;
  totalCapacity: number;
  usedCapacity: number;
}
