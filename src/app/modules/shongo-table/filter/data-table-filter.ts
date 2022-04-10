import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export type TableSettings = Record<string, unknown>;

export abstract class DataTableFilter {
  httpQuery$: Observable<HttpParams>;
  settings$: Observable<TableSettings>;
  private _httpQuery$ = new BehaviorSubject<HttpParams>(new HttpParams());
  private _settings$ = new BehaviorSubject<TableSettings>({});

  constructor() {
    this.httpQuery$ = this._httpQuery$.asObservable();
    this.settings$ = this._settings$.asObservable();
  }

  emitHttpQuery(): void {
    this._httpQuery$.next(this.getHttpQuery());
  }

  emitSettings(): void {
    this._settings$.next(this.getTableSettings());
  }

  abstract getTableSettings(): TableSettings;
  abstract getHttpQuery(): HttpParams;
}
