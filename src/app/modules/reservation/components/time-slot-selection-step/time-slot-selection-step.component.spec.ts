import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Spied } from 'src/app/test/models/spied.type';
import { authServiceStub } from 'src/app/test/stubs/auth-service.stub';
import { TimeSlotSelectionStepComponent } from './time-slot-selection-step.component';

describe('TimeSlotSelectionStepComponent', () => {
  let component: TimeSlotSelectionStepComponent;
  let fixture: ComponentFixture<TimeSlotSelectionStepComponent>;

  const reservationServiceStub = jasmine.createSpyObj(
    'ReservationRequestService',
    ['fetchItems']
  ) as Spied<ReservationRequestService>;
  reservationServiceStub.fetchItems.and.returnValue(of([]));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, MatButtonModule],
      declarations: [TimeSlotSelectionStepComponent],
      providers: [
        {
          provide: ReservationRequestService,
          useValue: reservationServiceStub,
        },
        { provide: AuthenticationService, useValue: authServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSlotSelectionStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
