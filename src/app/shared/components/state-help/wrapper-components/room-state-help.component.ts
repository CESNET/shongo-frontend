import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StateHelp } from 'src/app/shared/models/interfaces/state-help.interface';

@Component({
  selector: 'app-room-state-help',
  template: '<app-state-help [stateHelpMap]="stateHelpMap"></app-state-help>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomStateHelpComponent {
  stateHelpMap = new Map<string, StateHelp>([
    [
      $localize`:state:Unprepared`,
      {
        message: $localize`:state help:The room hasn't been prepared yet and thus participants cannot join the room.`,
        color: 'info',
      },
    ],
    [
      $localize`:state:Open`,
      {
        message: $localize`:state help:The room has been successfully opened and participants can join it.`,
        color: 'success',
      },
    ],
    [
      $localize`:state:Prepared`,
      {
        message: $localize`:state help:The room has been successfully prepared, but currently no capacity is available. The participants cannot join the room.`,
        color: 'ready',
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
      $localize`:state:Error`,
      {
        message: $localize`:state help:The room cannot be prepared due to an internal error and thus the participants cannot join it. System administrator has been informed about the reason of failure.`,
        color: 'error',
      },
    ],
  ]);
}
