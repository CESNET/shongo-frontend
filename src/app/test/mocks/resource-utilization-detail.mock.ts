import { ResourceUtilizationDetail } from 'src/app/shared/models/rest-api/resource-utilization-detail.interface';

export const resourceUtilizationDetailMock: ResourceUtilizationDetail = {
  id: 'shongo:maper-local:res:1',
  name: 'Pexip',
  interval: {
    start: '2021-11-03T18:38:09.546Z',
    end: '2021-11-03T18:38:09.546Z',
  },
  totalCapacity: 80,
  usedCapacity: 2,
  reservations: [
    {
      id: 'shongo:meetings.cesnet.cz:rsv:80',
      slot: {
        start: '2021-11-03T18:38:09.546Z',
        end: '2021-11-03T18:38:09.546Z',
      },
      licenceCount: 2,
      requestId: 'shongo:meetings.cesnet.cz:req:2',
      user: {
        userId: '1430cff140c2ce0a0c6751f130af3224b80306b9@einfra.cesnet.cz',
        principalNames: [
          '1430cff140c2ce0a0c6751f130af3224b80306b9@einfra.cesnet.cz',
          '492598@muni.cz',
        ],
        firstName: 'Filip',
        lastName: 'Karniš',
        organization: 'Masarykova univerzita',
        email: '492598@mail.muni.cz',
        fullName: 'Filip Karniš',
        locale: 'cz',
        zoneInfo: '',
        eduPersonEntitlement: [],
        rootOrganization: 'Masarykova univerzita',
        primaryEmail: '492598@mail.muni.cz',
        className: 'UserInformation',
      },
    },
  ],
};
