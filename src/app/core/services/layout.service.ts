import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly isTabletSize$: Observable<boolean>;
  readonly isLessThanSmall$: Observable<boolean>;
  readonly isLessThanLarge$: Observable<boolean>;
  readonly isLessThanMedium$: Observable<boolean>;

  constructor(private _brObserver: BreakpointObserver) {
    this.isLessThanSmall$ = this._brObserver
      .observe('screen and (max-width: 1279px)')
      .pipe(map((result) => result.matches));

    this.isLessThanMedium$ = this._brObserver
      .observe('screen and (max-width: 959px)')
      .pipe(map((result) => result.matches));

    this.isLessThanLarge$ = this._brObserver
      .observe('screen and (max-width: 1279px)')
      .pipe(map((result) => result.matches));

    this.isTabletSize$ = this._brObserver
      .observe('screen and (max-width: 768px)')
      .pipe(map((result) => result.matches));
  }
}
