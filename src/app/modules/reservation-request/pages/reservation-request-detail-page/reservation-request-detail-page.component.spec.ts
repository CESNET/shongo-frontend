import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { Spied } from 'src/app/test/models/spied.type';
import { ReservationRequestDetailPageComponent } from './reservation-request-detail-page.component';
import { mockReservationRequest } from 'src/app/test/mocks/reservation-request.mock';
import { ReservationRequestModule } from '../../reservation-request.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CertainityDialogStub } from 'src/app/test/stubs/certainity-dialog.stub';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReservationRequestDetailPageComponent', () => {
  let component: ReservationRequestDetailPageComponent;
  let fixture: ComponentFixture<ReservationRequestDetailPageComponent>;

  const resReqServiceStub = jasmine.createSpyObj('ReservationRequestService', [
    'fetchItem',
  ]) as Spied<ReservationRequestService>;
  resReqServiceStub.fetchItem.and.returnValue(of(mockReservationRequest));

  const certainityDialogStub = new CertainityDialogStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReservationRequestModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [ReservationRequestDetailPageComponent],
      providers: [
        { provide: ReservationRequestService, useValue: resReqServiceStub },
        { provide: MatDialog, useValue: certainityDialogStub },
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
