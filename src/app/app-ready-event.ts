import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppReadyEvent {
  private doc: Document;
  private isAppReady: boolean;

  constructor(@Inject(DOCUMENT) doc: any) {
    this.doc = doc;
    this.isAppReady = false;
  }

  // Trigger the "appready" event.
  public trigger(): void {
    // If the app-ready event has already been triggered, just ignore any subsequent
    // calls to trigger it again.
    if (this.isAppReady) {
      return;
    }

    var bubbles = true;
    var cancelable = false;

    this.doc.dispatchEvent(this.createEvent('appready', bubbles, cancelable));
    this.isAppReady = true;
  }

  // Create and return a custom event with the given configuration.
  private createEvent(
    eventType: string,
    bubbles: boolean,
    cancelable: boolean
  ): Event {
    // IE (shakes fist) uses some other kind of event initialization. As such,
    // we'll default to trying the "normal" event generation and then fallback to
    // using the IE version.
    try {
      var customEvent: any = new CustomEvent(eventType, {
        bubbles: bubbles,
        cancelable: cancelable,
      });
    } catch (error) {
      var customEvent: any = this.doc.createEvent('CustomEvent');
      customEvent.initCustomEvent(eventType, bubbles, cancelable);
    }

    return customEvent;
  }
}
