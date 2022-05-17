import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Users get redirected to this page when unauthorized to view some page.
 */
@Component({
  selector: 'app-unauthorized-page',
  templateUrl: './unauthorized-page.component.html',
  styleUrls: ['./unauthorized-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedPageComponent {}
