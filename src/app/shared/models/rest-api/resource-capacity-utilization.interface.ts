export interface ResourceCapacityUtilizationTableData {
  id: string;
  interval: string;
  pexip: string;
  tcs2: string;
  'connect-cesnet-new': string;
  'mcu-cesnet': string;
  'mcu-muni': string;
  'connect-cesnet-old': string;
  'freepbx-uvt': string;
}

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
