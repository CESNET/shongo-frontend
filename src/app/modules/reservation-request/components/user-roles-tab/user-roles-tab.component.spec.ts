import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolesTabComponent } from './user-roles-tab.component';

describe('UserRolesTabComponent', () => {
  let component: UserRolesTabComponent;
  let fixture: ComponentFixture<UserRolesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRolesTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
