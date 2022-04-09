import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-unauthorized-page',
  templateUrl: './unauthorized-page.component.html',
  styleUrls: ['./unauthorized-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedPageComponent {
  constructor() {}
}
