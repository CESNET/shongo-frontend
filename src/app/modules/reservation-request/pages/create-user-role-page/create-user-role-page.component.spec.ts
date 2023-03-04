import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { of } from 'rxjs';
import { GroupService } from 'src/app/core/http/group/group.service';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { UserService } from 'src/app/core/http/user/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateUserRolePageComponent } from './create-user-role-page.component';

describe('CreateUserRolePageComponent', () => {
  let component: CreateUserRolePageComponent;
  let fixture: ComponentFixture<CreateUserRolePageComponent>;

  const userServiceStub = {
    fetchItems: () => of({ count: 0, items: [] }),
  };
  const groupServiceStub = {
    fetchItems: () => of({ count: 0, items: [] }),
  };
  const resReqServiceStub = {
    postRole: () => of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatSelectModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule,
        NgxMatSelectSearchModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [CreateUserRolePageComponent],
      providers: [
        { provide: GroupService, useValue: groupServiceStub },
        { provide: ReservationRequestService, useValue: resReqServiceStub },
        { provide: UserService, useValue: userServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserRolePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
