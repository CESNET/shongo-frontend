import { TestBed } from '@angular/core/testing';
import { ApiService } from '../api.service';

import { ReservationRequestService } from './reservation-request.service';

describe('ReservationRequestService', () => {
  let service: ReservationRequestService;

  const apiServiceStub = jasmine.createSpyObj('ApiService', [
    'listData',
    'buildEndpointURL',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: apiServiceStub }],
    });
    service = TestBed.inject(ReservationRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
