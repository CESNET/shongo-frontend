import { NgModule } from '@angular/core';

/**
 * Ensures that a module gets loaded only once in the entire app.
 */
export class EnsureModuleLoadedOnceGuard {
  constructor(targetModule: NgModule) {
    if (targetModule) {
      throw new Error(
        `${targetModule.constructor.name} has already been loaded. Import this module in the AppModule only.`
      );
    }
  }
}
