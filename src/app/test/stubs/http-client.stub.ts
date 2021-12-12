import { HttpClient } from '@angular/common/http';

export const httpClientStub = jasmine.createSpyObj('HttpClient', [
  'get',
  'post',
  'put',
  'delete',
]) as HttpClient;
