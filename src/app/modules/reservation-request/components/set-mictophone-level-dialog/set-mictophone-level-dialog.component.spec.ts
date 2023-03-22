import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { SetMictophoneLevelDialogComponent } from './set-mictophone-level-dialog.component';

describe('SetMictophoneLevelDialogComponent', () => {
  let component: SetMictophoneLevelDialogComponent;
  let fixture: ComponentFixture<SetMictophoneLevelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetMictophoneLevelDialogComponent],
      imports: [MatDialogModule, MatButtonModule, MatSliderModule],
      providers: [
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { provide: MatDialog, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
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
