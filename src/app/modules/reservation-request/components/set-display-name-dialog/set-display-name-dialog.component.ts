import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getFormError } from 'src/app/utils/get-form-error';

@Component({
  selector: 'app-set-display-name-dialog',
  templateUrl: './set-display-name-dialog.component.html',
  styleUrls: ['./set-display-name-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetDisplayNameDialogComponent {
  nameCtrl = new FormControl(null, Validators.required);

  getFormError = getFormError;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { displayName: string }) {
    if (data.displayName) {
      this.nameCtrl.setValue(data.displayName);
    }
  }
}
