import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarAlertComponent } from 'src/app/shared/components/snackbar-alert/snackbar-alert.component';
import { AlertType } from 'src/app/shared/models/enums/alert-type.enum';

const SNACKBAR_DURATION = 5000;

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private _snackBar: MatSnackBar) {}

  showError(msg: string): void {
    this._showSnackbar(msg, AlertType.ERROR);
  }

  showWarning(msg: string): void {
    this._showSnackbar(msg, AlertType.WARNING);
  }

  showSuccess(msg: string): void {
    this._showSnackbar(msg, AlertType.SUCCESS);
  }

  private _showSnackbar(message: string, type: AlertType): void {
    this._snackBar.openFromComponent(SnackbarAlertComponent, {
      data: { message, type },
      announcementMessage: message,
      panelClass: ['snackbar--' + type],
      duration: SNACKBAR_DURATION,
    });
  }
}
