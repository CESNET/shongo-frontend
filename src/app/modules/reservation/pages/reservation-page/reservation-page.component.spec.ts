import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ReservationService } from 'src/app/core/http/reservation/reservation.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Spied } from 'src/app/test/models/spied.type';
import { ReservationModule } from '../../reservation.module';

import { ReservationPageComponent } from './reservation-page.component';

describe('ReservationPageComponent', () => {
  let component: ReservationPageComponent;
  let fixture: ComponentFixture<ReservationPageComponent>;

  const reservationServiceStub = jasmine.createSpyObj('ReservationService', [
    'fetchReservations',
  ]) as Spied<ReservationService>;
  reservationServiceStub.fetchReservations.and.returnValue(of([]));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationModule, BrowserAnimationsModule, SharedModule],
      declarations: [ReservationPageComponent],
      providers: [
        { provide: ReservationService, useValue: reservationServiceStub },
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
