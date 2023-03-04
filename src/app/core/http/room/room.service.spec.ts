import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { httpClientStub } from 'src/app/test/stubs/http-client.stub';
import { RoomService } from './room.service';

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientStub }],
    });
    service = TestBed.inject(RoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
