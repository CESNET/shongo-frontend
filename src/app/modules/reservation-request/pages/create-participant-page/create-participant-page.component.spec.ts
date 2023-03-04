import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { of } from 'rxjs';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { UserService } from 'src/app/core/http/user/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateParticipantPageComponent } from './create-participant-page.component';

describe('CreateParticipantPageComponent', () => {
  let component: CreateParticipantPageComponent;
  let fixture: ComponentFixture<CreateParticipantPageComponent>;

  const userServiceStub = {
    fetchItems: () => of({ count: 0, items: [] }),
  };
  const resReqServiceStub = {
    postUserParticipant: () => of({}),
    postGuestParticipant: () => of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        CommonModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        MatSelectModule,
        MatRadioModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [CreateParticipantPageComponent],
      providers: [
        { provide: UserService, useValue: userServiceStub },
        { provide: ReservationRequestService, useValue: resReqServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateParticipantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
