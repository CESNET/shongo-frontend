import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';

type AlertType = 'error' | 'success' | 'info';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() message: string = '';

  isActive = false;

  constructor(private _cd: ChangeDetectorRef) {}

  activate(): void {
    this.isActive = true;
    this._cd.detectChanges();
  }

  deactivate(): void {
    this.isActive = false;
    this._cd.detectChanges();
  }
}
