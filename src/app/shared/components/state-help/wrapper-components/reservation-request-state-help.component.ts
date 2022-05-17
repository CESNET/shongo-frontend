import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StateHelp } from '../../../models/interfaces/state-help.interface';

@Component({
  selector: 'app-reservation-request-state-help',
  template: '<app-state-help [stateHelpMap]="stateHelpMap"></app-state-help>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationRequestStateHelpComponent {
  stateHelpMap = new Map<string, StateHelp>([
    [
      $localize`:state:Error`,
      {
        message: $localize`:state help:The room cannot be created. System administrator has been informed about the reason of failure.`,
        color: 'error',
      },
    ],
    [
      $localize`:state:Created`,
      {
        message: $localize`:state help:The room has been successfully created, but participants cannot join it yet.`,
        color: 'success',
      },
    ],
    [
      $localize`:state:Prepared`,
      {
        message: $localize`:state help:The room has been successfully prepared, but currently no capacity is available. Participants cannot join the room.`,
        color: 'info',
      },
    ],
    [
      $localize`:state:Open`,
      {
        message: $localize`:state help:The room has been successfully opened and participants can join the room.`,
        color: 'success',
      },
    ],
    [
      $localize`:state:Stopped`,
      {
        message: $localize`:state help:The room has been stopped and thus the participants cannot join it.`,
        color: 'ready',
      },
    ],
    [
      $localize`:state:Modification failed`,
      {
        message: $localize`:state help:The room cannot be modified. The original room was kept untouched.`,
        color: 'error',
      },
    ],
  ]);
}
