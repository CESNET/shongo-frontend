import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordingsTabComponent } from './recordings-tab.component';
import { DatePipe } from '@angular/common';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { mockReservationRequest } from 'src/app/test/mocks/reservation-request.mock';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RecordingsTabComponent', () => {
  let component: RecordingsTabComponent;
  let fixture: ComponentFixture<RecordingsTabComponent>;

  const resReqServiceStub = { setRecording: () => of() };
  const dialogStub = { open: () => null };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecordingsTabComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        SharedModule,
        NoopAnimationsModule,
      ],
      providers: [
        DatePipe,
        { provide: ReservationRequestService, useValue: resReqServiceStub },
        { provide: MatDialog, useValue: dialogStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingsTabComponent);
    component = fixture.componentInstance;
    component.reservationRequest = mockReservationRequest;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
