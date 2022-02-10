import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';
import { ReservationService } from 'src/app/core/http/reservation/reservation.service';
import { MaterialModule } from 'src/app/modules/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { Spied } from 'src/app/test/models/spied.type';

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
