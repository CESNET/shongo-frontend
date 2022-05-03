import { ResourceCapacityUtilization } from 'src/app/shared/models/rest-api/resource-capacity-utilization.interface';

export const resourceCapacityUtilizationMock: ResourceCapacityUtilization = {
  interval: {
    start: '2022-27-01T00:00:00.000Z',
    end: '2022-27-01T00:00:00.000Z',
  },
  resources: [
    {
      id: 'shongo:meetings.cesnet.cz:res:42',
      name: 'Pexip',
      totalCapacity: 80,
      usedCapacity: 79,
    },
    {
      id: 'shongo:meetings.cesnet.cz:res:43',
      name: 'tcs2',
      totalCapacity: 100,
      usedCapacity: 8,
    },
    {
      id: 'shongo:meetings.cesnet.cz:res:44',
      name: 'connect-cesnet-new',
      totalCapacity: 95,
      usedCapacity: 30,
    },
    {
      id: 'shongo:meetings.cesnet.cz:res:45',
      name: 'mcu-cesnet',
      totalCapacity: 20,
      usedCapacity: 8,
    },
    {
      id: 'shongo:meetings.cesnet.cz:res:46',
      name: 'mcu-muni',
      totalCapacity: 33,
      usedCapacity: 11,
    },
    {
      id: 'shongo:meetings.cesnet.cz:res:47',
      name: 'connect-cesnet-old',
      totalCapacity: 158,
      usedCapacity: 78,
    },
    {
      id: 'shongo:meetings.cesnet.cz:res:48',
      name: 'FreePBX-UVT',
      totalCapacity: 44,
      usedCapacity: 3,
    },
  ],
};
