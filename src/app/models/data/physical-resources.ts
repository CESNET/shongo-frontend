import { PhysicalResourceType } from '../enums/physical-resource-type.enum';

export interface PhysicalResource {
  id: string;
  type: PhysicalResourceType;
  name: string;
}

export const physicalResources: PhysicalResource[] = [
  {
    id: 'G318',
    type: PhysicalResourceType.MEETING_ROOM,
    name: 'Malá zasedačka (Gotex, G318)',
  },
  {
    id: 'G317',
    type: PhysicalResourceType.MEETING_ROOM,
    name: 'Velká zasedačka (Gotex, G317)',
  },
  {
    id: 'C023',
    type: PhysicalResourceType.MEETING_ROOM,
    name: 'Klub ÚVT (Botanická, C023)',
  },
  {
    id: 'G331',
    type: PhysicalResourceType.MEETING_ROOM,
    name: 'Zasedačka ÚVT (Gotex, G331)',
  },
  {
    id: 'G367',
    type: PhysicalResourceType.MEETING_ROOM,
    name: 'Zasedačka u ředitelny (Gotex, G367)',
  },
  {
    id: 'P20',
    type: PhysicalResourceType.PARKING_PLACE,
    name: 'Šumavská 20 - Parkovací místo',
  },
  {
    id: 'P84',
    type: PhysicalResourceType.PARKING_PLACE,
    name: 'Šumavská 84 - Parkovací místo',
  },
];
