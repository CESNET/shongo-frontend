import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

/**
 * Event emitted on after app bootstrap. Used to destroy bootstrap loading screen.
 */
@Injectable({
  providedIn: 'root',
})
export class AppReadyEvent {
  private doc: Document;
  private isAppReady: boolean;

  constructor(@Inject(DOCUMENT) doc: Document) {
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

    const bubbles = true;
    const cancelable = false;

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
    let customEvent: CustomEvent;

    try {
      customEvent = new CustomEvent(eventType, {
        bubbles: bubbles,
        cancelable: cancelable,
      });
    } catch (error) {
      customEvent = this.doc.createEvent('CustomEvent');
      customEvent.initCustomEvent(eventType, bubbles, cancelable);
    }

    return customEvent;
  }
}
