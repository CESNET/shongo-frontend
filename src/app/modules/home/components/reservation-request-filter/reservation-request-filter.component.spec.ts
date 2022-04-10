import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservationRequestFilterComponent } from './reservation-request-filter.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { httpClientStub } from 'src/app/test/stubs/http-client.stub';
import { HttpClient } from '@angular/common/http';

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
