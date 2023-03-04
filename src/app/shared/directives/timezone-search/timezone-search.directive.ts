import { Directive, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectSearchComponent } from 'ngx-mat-select-search';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IANA_TIMEZONES, Timezone } from '../../models/data/timezones';

/**
 * Sets up timezone search on NgxMatSelectSearch element.
 * Uses moment timezone data.
 */
@Directive({ selector: '[appTimezoneSearch]', exportAs: 'timezoneSearch' })
export class TimezoneSearchDirective implements OnInit, OnDestroy {
  filteredTimezones: Observable<Timezone[]>;

  private _filteredTimezones$ = new BehaviorSubject<Timezone[]>(IANA_TIMEZONES);
  private _filterCtrl = new FormControl();
  private _destroy$ = new Subject<void>();

  constructor(private _host: MatSelectSearchComponent) {
    this.filteredTimezones = this._filteredTimezones$.asObservable();
  }

  ngOnInit(): void {
    this._initTimeZoneFilter(this._filterCtrl);

    this._host._formControl = this._filterCtrl;
    this._host.placeholderLabel = $localize`:placeholder:Select timezone...`;
    this._host.noEntriesFoundLabel = $localize`:fallback text:No timezones found`;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Observes filter control value changes and returns timezones filtered by value.
   */
  private _initTimeZoneFilter(filterControl: FormControl): void {
    filterControl.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((filter) => {
        this._filteredTimezones$.next(this._filterTimeZones(filter));
      });
  }

  /**
   * Returns timezones filtered based on filter value.
   *
   * @param filter Filter value.
   * @returns Filtered timezones.
   */
  private _filterTimeZones(filter: string): Timezone[] {
    if (!filter) {
      return IANA_TIMEZONES;
    }

    return IANA_TIMEZONES.filter((timeZone) =>
      timeZone.label.toLowerCase().includes(filter.toLowerCase())
    );
  }
}
