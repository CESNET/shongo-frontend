import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { ReservationService } from 'src/app/core/http/reservation/reservation.service';
import { Spied } from 'src/app/test/models/spied.type';
import { authServiceStub } from 'src/app/test/stubs/auth-service.stub';
import { HomeModule } from '../../../modules/home/home.module';
import { ReservationCalendarComponent } from './reservation-calendar.component';

describe('ReservationCalendarComponent', () => {
  let component: ReservationCalendarComponent;
  let fixture: ComponentFixture<ReservationCalendarComponent>;

  const reservationServiceStub = jasmine.createSpyObj('ReservationService', [
    'fetchReservations',
  ]) as Spied<ReservationService>;

  reservationServiceStub.fetchReservations.and.returnValue(
    of({
      count: 0,
      items: [],
    })
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationCalendarComponent],
      imports: [HomeModule, BrowserAnimationsModule],
      providers: [
        { provide: ReservationService, useValue: reservationServiceStub },
        { provide: AuthenticationService, useValue: authServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
