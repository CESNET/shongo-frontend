import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export type TableSettings = Record<string, unknown>;

export abstract class DataTableFilter {
  /**
   * Observable of HTTP query parameters created by filter.
   */
  readonly httpQuery$: Observable<HttpParams>;

  /**
   * Observable of table settings.
   */
  readonly settings$: Observable<TableSettings>;

  private readonly _httpQuery$ = new BehaviorSubject<HttpParams>(
    new HttpParams()
  );
  private readonly _settings$ = new BehaviorSubject<TableSettings>({});

  constructor() {
    this.httpQuery$ = this._httpQuery$.asObservable();
    this.settings$ = this._settings$.asObservable();
  }

  /**
   * Emits current HTTP query parameters.
   */
  emitHttpQuery(): void {
    this._httpQuery$.next(this.getHttpQuery());
  }

  /**
   * Emits current table settings.
   */
  emitSettings(): void {
    this._settings$.next(this.getTableSettings());
  }

  /**
   * Gets table settings from the filter component.
   */
  abstract getTableSettings(): TableSettings;

  /**
   * Gets HTTP query parameters from the filter component.
   */
  abstract getHttpQuery(): HttpParams;
}
