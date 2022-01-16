import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

export type StateColor = 'error' | 'success' | 'info' | 'ready';

@Component({
  selector: 'app-state-chip',
  templateUrl: './state-chip.component.html',
  styleUrls: ['./state-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateChipComponent {
  @Input() color!: StateColor;
  @Input() state!: string;

  constructor() {}
}
