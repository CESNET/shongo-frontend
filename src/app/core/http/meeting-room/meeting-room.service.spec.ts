import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { httpClientStub } from 'src/app/test/stubs/http-client.stub';

import { MeetingRoomService } from './meeting-room.service';

describe('MeetingRoomService', () => {
  let service: MeetingRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientStub }],
    });
    service = TestBed.inject(MeetingRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
