import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CreateUserRolePageComponent } from './create-user-role-page.component';

describe('CreateUserRolePageComponent', () => {
  let component: CreateUserRolePageComponent;
  let fixture: ComponentFixture<CreateUserRolePageComponent>;

  const mockRoute = {
    params: of({ id: 'shongo:meetings.cesnet.cz:req:1' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatSelectModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      declarations: [CreateUserRolePageComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockRoute }],
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
