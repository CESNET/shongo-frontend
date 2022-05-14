import { Component, ChangeDetectionStrategy } from '@angular/core';
import * as moment from 'moment';

/**
 * App footer.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  currentYear = moment().year();

  constructor() {}
}
