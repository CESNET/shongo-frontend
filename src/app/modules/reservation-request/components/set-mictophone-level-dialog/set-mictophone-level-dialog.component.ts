import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-set-mictophone-level-dialog',
  templateUrl: './set-mictophone-level-dialog.component.html',
  styleUrls: ['./set-mictophone-level-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetMictophoneLevelDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { microphoneLevel?: string }
  ) {}
}
