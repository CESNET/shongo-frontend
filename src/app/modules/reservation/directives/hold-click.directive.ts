import { Directive, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const START_DELAY = 500;
const CLICK_INTERVAL = 100;

/**
 * Support for hold click.
 */
@Directive({
  selector: '[appHoldClick]',
})
export class HoldClickDirective implements OnDestroy {
  destroy$ = new Subject<void>();

  constructor(private _element: ElementRef) {}

  /**
   * Starts a timer which will emit events after a defined delay in a defined interval.
   * Click event gets triggered on host element on every emission.
   */
  @HostListener('mousedown')
  @HostListener('touchstart')
  onHoldStart(): void {
    timer(START_DELAY, CLICK_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const nativeElement = this._element.nativeElement as HTMLElement;
        nativeElement.click();
      });
  }

  /**
   * Stops timer on any mouse leave event.
   */
  @HostListener('mouseup')
  @HostListener('mouseout')
  @HostListener('mouseleave')
  @HostListener('touchend')
  @HostListener('touchcancel')
  @HostListener('touchmove')
  onHoldEnd(): void {
    this.destroy$.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
