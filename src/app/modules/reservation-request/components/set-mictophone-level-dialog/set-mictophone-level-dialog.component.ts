import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

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
