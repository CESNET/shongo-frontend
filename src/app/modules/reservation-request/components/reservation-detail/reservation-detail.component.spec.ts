import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { mockReservationRequest } from 'src/app/test/mocks/reservation-request.mock';
import { ReservationDetailComponent } from './reservation-detail.component';

describe('ReservationDetailComponent', () => {
  let component: ReservationDetailComponent;
  let fixture: ComponentFixture<ReservationDetailComponent>;

  const resReqServiceStub = {
    fetchItem: () => of(mockReservationRequest),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        MatFormFieldModule,
        MatRadioModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
      declarations: [ReservationDetailComponent],
      providers: [
        DatePipe,
        { provide: ReservationRequestService, useValue: resReqServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationDetailComponent);
    component = fixture.componentInstance;
    component.reservationRequest = mockReservationRequest;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
