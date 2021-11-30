import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservationRequestFilterComponent } from './reservation-request-filter.component';
import { MaterialModule } from 'src/app/modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ReservationRequestFilterComponent', () => {
  let component: ReservationRequestFilterComponent;
  let fixture: ComponentFixture<ReservationRequestFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationRequestFilterComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
      ],
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
