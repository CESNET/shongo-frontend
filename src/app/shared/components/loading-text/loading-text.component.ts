import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-loading-text',
  templateUrl: './loading-text.component.html',
  styleUrls: ['./loading-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingTextComponent {
  @Input() message: string = $localize`loading...`;

  constructor() {}
}
