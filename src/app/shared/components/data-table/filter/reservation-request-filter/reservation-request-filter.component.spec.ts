import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationRequestFilterComponent } from './reservation-request-filter.component';

describe('ReservationRequestFilterComponent', () => {
  let component: ReservationRequestFilterComponent;
  let fixture: ComponentFixture<ReservationRequestFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationRequestFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationRequestFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
