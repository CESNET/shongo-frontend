import { Directive, ViewContainerRef } from '@angular/core';

/**
 * Host directive for component injection.
 */
@Directive({
  selector: '[appComponentHost]',
})
export class ComponentHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
