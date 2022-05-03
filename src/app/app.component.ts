import { Component } from '@angular/core';
import { AppReadyEvent } from './app-ready-event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'shongo-frontend';

  constructor(appReadyEvent: AppReadyEvent) {
    appReadyEvent.trigger();
  }
}
