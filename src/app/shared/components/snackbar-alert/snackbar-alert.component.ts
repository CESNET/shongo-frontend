import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { AlertType } from '../../models/enums/alert-type.enum';
import { Alert } from '../../models/interfaces/alert.interface';

@Component({
  selector: 'app-snackbar-alert',
  templateUrl: './snackbar-alert.component.html',
  styleUrls: ['./snackbar-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarAlertComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: Alert,
    private _snackbarRef: MatSnackBarRef<SnackbarAlertComponent>
  ) {}

  /**
   * Returns alert icon based on alert type.
   *
   * @param alertType Alert type.
   * @returns Material icon name.
   */
  getAlertIcon(alertType: AlertType): string {
    switch (alertType) {
      case AlertType.ERROR:
        return 'error';
      case AlertType.WARNING:
        return 'warning';
      case AlertType.SUCCESS:
        return 'check_circle';
      default:
        return '';
    }
  }

  close(): void {
    this._snackbarRef.dismiss();
  }
}
