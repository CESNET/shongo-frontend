import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSettingsFormComponent } from './advanced-settings-form.component';

describe('AdvancedSettingsFormComponent', () => {
  let component: AdvancedSettingsFormComponent;
  let fixture: ComponentFixture<AdvancedSettingsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvancedSettingsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedSettingsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
