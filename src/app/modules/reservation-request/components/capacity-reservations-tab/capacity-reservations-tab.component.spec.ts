import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ShongoTableModule } from 'src/app/modules/shongo-table/shongo-table.module';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ReservationRequest } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { SharedModule } from 'src/app/shared/shared.module';
import { mockReservationRequest } from 'src/app/test/mocks/reservation-request.mock';
import { CertainityDialogStub } from 'src/app/test/stubs/certainity-dialog.stub';
import { CapacityReservationsTabComponent } from './capacity-reservations-tab.component';

describe('CapacityReservationsTabComponent', () => {
  let component: CapacityReservationsTabComponent;
  let fixture: ComponentFixture<CapacityReservationsTabComponent>;

  const mockRoute = {
    params: of({ id: 'shongo:meetings.cesnet.cz:req:1' }),
  };
  const mockReservationRequestService = {
    fetchTableItems: (): Observable<ApiResponse<ReservationRequest>> => {
      return of({
        count: 1,
        items: [mockReservationRequest],
      });
    },
  };
  const matDialogStub = new CertainityDialogStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, NoopAnimationsModule, ShongoTableModule],
      declarations: [CapacityReservationsTabComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        {
          provide: ReservationRequestService,
          useValue: mockReservationRequestService,
        },
        { provide: MatDialog, useValue: matDialogStub },
        DatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacityReservationsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
