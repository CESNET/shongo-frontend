import { HttpClient } from '@angular/common/http';
import { Spied } from '../models/spied.type';

export const httpClientStub = jasmine.createSpyObj('HttpClient', [
  'get',
  'post',
  'put',
  'delete',
]) as Spied<HttpClient>;
