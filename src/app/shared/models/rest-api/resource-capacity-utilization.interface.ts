export interface ResourceCapacityUtilization {
  id: string;
  date: string;
  pexip: number;
  tcs2: number;
  'connect-cesnet-new': number;
  'mcu-cesnet': number;
  'mcu-muni': number;
  'connect-cesnet-old': number;
  'freepbx-uvt': number;
}
