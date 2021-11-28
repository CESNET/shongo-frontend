import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export abstract class DataTableFilter {
  httpQuery$: Observable<HttpParams>;
  private _httpQuery$ = new BehaviorSubject<HttpParams>(new HttpParams());

  constructor() {
    this.httpQuery$ = this._httpQuery$.asObservable();
  }

  emitHttpQuery(): void {
    this._httpQuery$.next(this.getHttpQuery());
  }

  abstract getHttpQuery(): HttpParams;
}
