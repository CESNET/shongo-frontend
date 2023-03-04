import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ShongoTableModule } from 'src/app/modules/shongo-table/shongo-table.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CertainityDialogStub } from 'src/app/test/stubs/certainity-dialog.stub';
import { ParticipantsTabComponent } from './participants-tab.component';

describe('ParticipantsTabComponent', () => {
  let component: ParticipantsTabComponent;
  let fixture: ComponentFixture<ParticipantsTabComponent>;

  const resReqServiceStub = {
    fetchParticipants: () => of({ count: 0, items: [] }),
  };
  const dialogStub = new CertainityDialogStub();
  const mockRoute = {
    params: of({ id: 'shongo:meetings.cesnet.cz:req:1' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        NoopAnimationsModule,
        MatIconModule,
        ShongoTableModule,
      ],
      declarations: [ParticipantsTabComponent],
      providers: [
        { provide: ReservationRequestService, useValue: resReqServiceStub },
        { provide: MatDialog, useValue: dialogStub },
        { provide: ActivatedRoute, useValue: mockRoute },
        DatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
