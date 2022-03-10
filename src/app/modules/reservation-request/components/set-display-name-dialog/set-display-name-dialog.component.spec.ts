import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDisplayNameDialogComponent } from './set-display-name-dialog.component';

describe('SetDisplayNameDialogComponent', () => {
  let component: SetDisplayNameDialogComponent;
  let fixture: ComponentFixture<SetDisplayNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetDisplayNameDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDisplayNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
