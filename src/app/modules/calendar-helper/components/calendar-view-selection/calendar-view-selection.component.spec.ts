import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CalendarViewSelectionComponent } from './calendar-view-selection.component';

describe('CalendarViewSelectionComponent', () => {
  let component: CalendarViewSelectionComponent;
  let fixture: ComponentFixture<CalendarViewSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatMenuModule, MatIconModule],
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
