import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { httpClientStub } from 'src/app/test/stubs/http-client.stub';
import { ReservationRequestFilterComponent } from './reservation-request-filter.component';

describe('ReservationRequestFilterComponent', () => {
  let component: ReservationRequestFilterComponent;
  let fixture: ComponentFixture<ReservationRequestFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationRequestFilterComponent],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatCheckboxModule,
      ],
      providers: [{ provide: HttpClient, useValue: httpClientStub }],
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
