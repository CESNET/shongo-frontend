import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarAlertComponent } from 'src/app/shared/components/snackbar-alert/snackbar-alert.component';
import { AlertType } from 'src/app/shared/models/enums/alert-type.enum';

/**
 * Duration of snackbar's appearance after which it disappears.
 */
const SNACKBAR_DURATION = 5000;

/**
 * Service for displaying in-app alerts with MatSnackbar.
 */
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private _snackBar: MatSnackBar) {}

  /**
   * Shows error alert.
   *
   * @param msg Alert message.
   */
  showError(msg: string): void {
    this._checkMessage(msg);
    this._showSnackbar(msg, AlertType.ERROR);
  }

  /**
   * Shows warning alert.
   *
   * @param msg Alert message.
   */
  showWarning(msg: string): void {
    this._checkMessage(msg);
    this._showSnackbar(msg, AlertType.WARNING);
  }

  /**
   * Shows success alert.
   *
   * @param msg Alert message.
   */
  showSuccess(msg: string): void {
    this._checkMessage(msg);
    this._showSnackbar(msg, AlertType.SUCCESS);
  }

  /**
   * Opens material snackbar component.
   *
   * @param message Alert message.
   * @param type Alert type.
   */
  private _showSnackbar(message: string, type: AlertType): void {
    this._snackBar.openFromComponent(SnackbarAlertComponent, {
      data: { message, type },
      announcementMessage: message,
      panelClass: ['snackbar', 'snackbar--' + type],
    });
  }

  /**
   * Checks if alert message is defined.
   *
   * @param msg Alert message.
   */
  private _checkMessage(msg: string): void {
    if (!msg) {
      throw new Error('Snackbar alert must contain a message.');
    }
  }
}
