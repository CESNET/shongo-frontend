import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown-section',
  templateUrl: './dropdown-section.component.html',
  styleUrls: ['./dropdown-section.component.scss'],
  animations: [
    trigger('expand', [
      state('true', style({ height: '*' })),
      state('false', style({ height: '0' })),
      transition('true <=> false', animate('200ms ease-in-out')),
    ]),
    trigger('rotate', [
      state('true', style({ transform: 'rotate(180deg)' })),
      state('false', style({ transform: 'rotate(0)' })),
      transition('true <=> false', animate('100ms ease-in-out')),
    ]),
  ],
})
export class DropdownSectionComponent {
  @Input({ required: true }) label!: string;

  expanded = false;

  toggle() {
    this.expanded = !this.expanded;
  }
}
