import { ResourceType } from 'src/app/shared/models/enums/resource-type.enum';

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
}

export const resources: Resource[] = [
  {
    id: 'G318',
    type: ResourceType.MEETING_ROOM,
    name: 'Malá zasedačka (Gotex, G318)',
  },
  {
    id: 'G317',
    type: ResourceType.MEETING_ROOM,
    name: 'Velká zasedačka (Gotex, G317)',
  },
  {
    id: 'C023',
    type: ResourceType.MEETING_ROOM,
    name: 'Klub ÚVT (Botanická, C023)',
  },
  {
    id: 'G331',
    type: ResourceType.MEETING_ROOM,
    name: 'Zasedačka ÚVT (Gotex, G331)',
  },
  {
    id: 'G367',
    type: ResourceType.MEETING_ROOM,
    name: 'Zasedačka u ředitelny (Gotex, G367)',
  },
  {
    id: 'P20',
    type: ResourceType.PARKING_PLACE,
    name: 'Šumavská 20 - Parkovací místo',
  },
  {
    id: 'P84',
    type: ResourceType.PARKING_PLACE,
    name: 'Šumavská 84 - Parkovací místo',
  },
  {
    id: 'pexip',
    type: ResourceType.VIRTUAL_ROOM,
    name: 'Videoconference (Pexip)',
  },
  {
    id: 'adobe_connect',
    type: ResourceType.VIRTUAL_ROOM,
    name: 'Webconference (Adobe Connect)',
  },
  {
    id: 'teleconference',
    type: ResourceType.VIRTUAL_ROOM,
    name: 'Teleconference',
  },
];
