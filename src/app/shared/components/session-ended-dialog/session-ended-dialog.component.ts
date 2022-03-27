import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';

@Component({
  selector: 'app-session-ended-dialog',
  templateUrl: './session-ended-dialog.component.html',
  styleUrls: ['./session-ended-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionEndedDialogComponent {
  constructor(public auth: AuthenticationService) {}
}
