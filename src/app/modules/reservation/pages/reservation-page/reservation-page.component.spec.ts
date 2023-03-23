import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Spied } from 'src/app/test/models/spied.type';
import { createResourceServiceSpy } from 'src/app/test/spies/resource-service.spy';
import { AuthServiceStub } from 'src/app/test/stubs/auth-service.stub';
import { ReservationModule } from '../../reservation.module';
import { ReservationPageComponent } from './reservation-page.component';

describe('ReservationPageComponent', () => {
  let component: ReservationPageComponent;
  let fixture: ComponentFixture<ReservationPageComponent>;

  const reservationRequestServiceStub = jasmine.createSpyObj(
    'ReservationRequestService',
    ['fetchItems']
  ) as Spied<ReservationRequestService>;
  reservationRequestServiceStub.fetchItems.and.returnValue(of([]));

  const authServiceStub = new AuthServiceStub();

  const resourceServiceSpy = createResourceServiceSpy();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReservationModule,
        NoopAnimationsModule,
        SharedModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [ReservationPageComponent],
      providers: [
        {
          provide: ReservationRequestService,
          useValue: reservationRequestServiceStub,
        },
        { provide: AuthenticationService, useValue: authServiceStub },
        { provide: ResourceService, useValue: resourceServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
