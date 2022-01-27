import { ResourceCapacityUtilization } from 'src/app/shared/models/rest-api/resource-capacity-utilization.interface';

export const resourceCapacityUtilizationMock: ResourceCapacityUtilization = {
  id: '1',
  date: '2022-27-01T00:00:00.000Z',
  pexip: 0.12,
  tcs2: 0.58,
  'connect-cesnet-new': 1,
  'mcu-cesnet': 0.01,
  'mcu-muni': 0.74,
  'connect-cesnet-old': 0.09,
  'freepbx-uvt': 0.99,
};
