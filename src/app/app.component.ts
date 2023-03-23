import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AppReadyEvent } from './app-ready-event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'shongo-frontend';

  constructor(
    appReadyEvent: AppReadyEvent,
    private _matIconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer
  ) {
    this._registerFlags();
    appReadyEvent.trigger();
  }

  private _registerFlags() {
    this._matIconRegistry.addSvgIcon(
      'flag-cz',
      this._domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/i18n/CZ.svg'
      )
    );
    this._matIconRegistry.addSvgIcon(
      'flag-en',
      this._domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/i18n/GB.svg'
      )
    );
  }
}
