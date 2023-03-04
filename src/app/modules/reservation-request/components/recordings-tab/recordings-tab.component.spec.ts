import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ShongoTableModule } from 'src/app/modules/shongo-table/shongo-table.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { mockReservationRequest } from 'src/app/test/mocks/reservation-request.mock';
import { RecordingsTabComponent } from './recordings-tab.component';

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
        ShongoTableModule,
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
