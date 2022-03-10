import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetMictophoneLevelDialogComponent } from './set-mictophone-level-dialog.component';

describe('SetMictophoneLevelDialogComponent', () => {
  let component: SetMictophoneLevelDialogComponent;
  let fixture: ComponentFixture<SetMictophoneLevelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetMictophoneLevelDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetMictophoneLevelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
