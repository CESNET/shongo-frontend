import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { httpClientStub } from 'src/app/test/stubs/http-client.stub';
import { ReservationRequestService } from './reservation-request.service';

describe('ReservationRequestService', () => {
  let service: ReservationRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientStub }],
    });
    service = TestBed.inject(ReservationRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
