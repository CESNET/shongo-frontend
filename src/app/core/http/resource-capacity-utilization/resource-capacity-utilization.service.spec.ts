import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { httpClientStub } from 'src/app/test/stubs/http-client.stub';
import { ResourceCapacityUtilizationService } from './resource-capacity-utilization.service';

describe('ResourceCapacityUtilizationService', () => {
  let service: ResourceCapacityUtilizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientStub }],
    });
    service = TestBed.inject(ResourceCapacityUtilizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
