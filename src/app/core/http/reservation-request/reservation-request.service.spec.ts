import { TestBed } from '@angular/core/testing';
import { ReservationRequestService } from './reservation-request.service';
import { httpClientStub } from 'src/app/test/stubs/http-client.stub';
import { HttpClient } from '@angular/common/http';

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
