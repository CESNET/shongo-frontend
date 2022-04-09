import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { Spied } from 'src/app/test/models/spied.type';
import { authServiceStub } from 'src/app/test/stubs/auth-service.stub';
import { HomeModule } from '../../../home/home.module';
import { ReservationCalendarComponent } from './reservation-calendar.component';

describe('ReservationCalendarComponent', () => {
  let component: ReservationCalendarComponent;
  let fixture: ComponentFixture<ReservationCalendarComponent>;

  const resReqServiceStub = jasmine.createSpyObj('ReservationRequestService', [
    'fetchItems',
  ]) as Spied<ReservationRequestService>;

  resReqServiceStub.fetchItems.and.returnValue(
    of({
      count: 0,
      items: [],
    })
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationCalendarComponent],
      imports: [HomeModule, NoopAnimationsModule],
      providers: [
        { provide: ReservationRequestService, useValue: resReqServiceStub },
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
