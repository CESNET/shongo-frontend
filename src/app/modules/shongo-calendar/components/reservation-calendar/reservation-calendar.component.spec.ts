import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { SettingsService } from 'src/app/core/http/settings/settings.service';
import { Spied } from 'src/app/test/models/spied.type';
import { AuthServiceStub } from 'src/app/test/stubs/auth-service.stub';
import { SettingsServiceStub } from 'src/app/test/stubs/settings-service.stub';
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

  const resourceServiceStub = jasmine.createSpyObj('ResourceService', [
    'findResourceById',
  ]);

  const authServiceStub = new AuthServiceStub();

  const settingsServiceStub = new SettingsServiceStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationCalendarComponent],
      imports: [HomeModule, NoopAnimationsModule],
      providers: [
        { provide: ReservationRequestService, useValue: resReqServiceStub },
        { provide: AuthenticationService, useValue: authServiceStub },
        { provide: SettingsService, useValue: settingsServiceStub },
        { provide: ResourceService, useValue: resourceServiceStub },
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
