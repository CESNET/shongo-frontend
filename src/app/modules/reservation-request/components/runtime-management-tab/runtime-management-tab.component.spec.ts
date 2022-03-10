import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuntimeManagementTabComponent } from './runtime-management-tab.component';

describe('RuntimeManagementTabComponent', () => {
  let component: RuntimeManagementTabComponent;
  let fixture: ComponentFixture<RuntimeManagementTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RuntimeManagementTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuntimeManagementTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
