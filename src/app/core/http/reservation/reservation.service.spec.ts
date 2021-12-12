import { TestBed } from '@angular/core/testing';
import { ReservationService } from './reservation.service';
import { httpClientStub } from 'src/app/test/stubs/http-client.stub';
import { HttpClient } from '@angular/common/http';

describe('ReservationService', () => {
  let service: ReservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientStub }],
    });
    service = TestBed.inject(ReservationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
