import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { UserSnapshotDialogComponent } from './user-snapshot-dialog.component';

describe('UserSnapshotDialogComponent', () => {
  let component: UserSnapshotDialogComponent;
  let fixture: ComponentFixture<UserSnapshotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSnapshotDialogComponent],
      imports: [MatDialogModule, MatButtonModule],
      providers: [
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { provide: MatDialog, useValue: { close: () => {} } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { participant: { id: '1' } },
        },
      ],
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
