import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { OAuthService } from 'angular-oauth2-oidc';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { ReservationService } from 'src/app/core/http/reservation/reservation.service';
import { MaterialModule } from 'src/app/modules/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { Spied } from 'src/app/test/models/spied.type';
import { authServiceStub } from 'src/app/test/stubs/auth-service.stub';
import { TimeSlotSelectionStepComponent } from './time-slot-selection-step.component';

describe('TimeSlotSelectionStepComponent', () => {
  let component: TimeSlotSelectionStepComponent;
  let fixture: ComponentFixture<TimeSlotSelectionStepComponent>;

  const reservationServiceStub = jasmine.createSpyObj('ReservationService', [
    'fetchReservations',
  ]) as Spied<ReservationService>;
  reservationServiceStub.fetchReservations.and.returnValue(of([]));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, MatButtonModule],
      declarations: [TimeSlotSelectionStepComponent],
      providers: [
        { provide: ReservationService, useValue: reservationServiceStub },
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
