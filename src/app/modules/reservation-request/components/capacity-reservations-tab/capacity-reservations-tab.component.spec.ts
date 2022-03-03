import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityReservationsTabComponent } from './capacity-reservations-tab.component';

describe('CapacityReservationsTabComponent', () => {
  let component: CapacityReservationsTabComponent;
  let fixture: ComponentFixture<CapacityReservationsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CapacityReservationsTabComponent],
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
