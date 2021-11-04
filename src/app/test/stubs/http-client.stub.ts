export const httpClientStub = jasmine.createSpyObj('HttpClient', [
  'get',
  'post',
  'put',
  'delete',
]);
