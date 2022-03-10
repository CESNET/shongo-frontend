import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSnapshotDialogComponent } from './user-snapshot-dialog.component';

describe('UserSnapshotDialogComponent', () => {
  let component: UserSnapshotDialogComponent;
  let fixture: ComponentFixture<UserSnapshotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSnapshotDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSnapshotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
