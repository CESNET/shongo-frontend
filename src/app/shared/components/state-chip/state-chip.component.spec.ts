import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateChipComponent } from './state-chip.component';

describe('StateChipComponent', () => {
  let component: StateChipComponent;
  let fixture: ComponentFixture<StateChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StateChipComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
