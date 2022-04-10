import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { StateHelp } from '../../models/interfaces/state-help.interface';

@Component({
  selector: 'app-state-help',
  templateUrl: './state-help.component.html',
  styleUrls: ['./state-help.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateHelpComponent {
  @Input() stateHelpMap!: Map<string, StateHelp>;

  constructor() {}
}
