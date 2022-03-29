import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-certainity-check',
  templateUrl: './certainity-check.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertainityCheckComponent {
  constructor(
    public dialogRef: MatDialogRef<CertainityCheckComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message?: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
