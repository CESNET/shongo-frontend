import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarViewSelectionComponent } from './calendar-view-selection.component';

describe('CalendarViewSelectionComponent', () => {
  let component: CalendarViewSelectionComponent;
  let fixture: ComponentFixture<CalendarViewSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarViewSelectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarViewSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
