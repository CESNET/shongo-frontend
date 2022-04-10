import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { httpClientStub } from 'src/app/test/stubs/http-client.stub';
import { ResourceService } from './resource.service';

describe('ResourceService', () => {
  let service: ResourceService;

  // Mock returning a list of resources from backend.
  httpClientStub.get.and.returnValue(of([]));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientStub }],
    });
    service = TestBed.inject(ResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
