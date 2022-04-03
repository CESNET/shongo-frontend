import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { Spied } from 'src/app/test/models/spied.type';
import { ReservationRequestDetailPageComponent } from './reservation-request-detail-page.component';
import { mockReservationRequest } from 'src/app/test/mocks/reservation-request.mock';
import { ReservationRequestModule } from '../../reservation-request.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ReservationRequestDetailPageComponent', () => {
  let component: ReservationRequestDetailPageComponent;
  let fixture: ComponentFixture<ReservationRequestDetailPageComponent>;

  const mockRoute = { params: of({ id: '1' }) };
  const resReqServiceStub = jasmine.createSpyObj('ReservationRequestService', [
    'fetchItem',
  ]) as Spied<ReservationRequestService>;
  resReqServiceStub.fetchItem.and.returnValue(of(mockReservationRequest));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationRequestModule, NoopAnimationsModule],
      declarations: [ReservationRequestDetailPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: ReservationRequestService, useValue: resReqServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationRequestDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
