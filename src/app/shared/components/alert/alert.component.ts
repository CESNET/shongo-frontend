import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { AlertType } from '../../models/enums/alert-type.enum';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  /**
   * Alert type: warning, success or error.
   */
  @Input() type: AlertType = AlertType.WARNING;

  /**
   * Message displayed inside alert.
   */
  @Input() message: string = '';

  /**
   * Whether a button for closing alert should be shown.
   */
  @Input() showCloseButton = true;

  /**
   * Whether alert is active and thus visible.
   */
  @Input()
  get isActive(): boolean {
    return this._isActive;
  }
  set isActive(value: boolean) {
    this._isActive = value;
    this._cd.detectChanges();
  }

  private _isActive: boolean = false;

  constructor(private _cd: ChangeDetectorRef) {}

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
}
