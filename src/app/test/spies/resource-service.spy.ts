import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { Spied } from '../models/spied.type';

export const createResourceServiceSpy = (): Spied<ResourceService> => {
  return jasmine.createSpyObj('ResourceService', [
    'fetchCapacityUtilization',
    'fetchResourceUtilization',
    'getPhysicalResourceTags',
    'getVirtualRoomTechnologies',
  ]);
};
