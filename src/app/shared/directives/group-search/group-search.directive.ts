import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Directive, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectSearchComponent } from 'ngx-mat-select-search';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, debounceTime, first } from 'rxjs/operators';
import { GroupService } from 'src/app/core/http/group/group.service';
import { SEARCH_DEBOUNCE_TIME } from '../../config/search-debounce-time';
import { Group } from '../../models/rest-api/group.interface';

export interface GroupSearchItem {
  id: string;
  group: string;
}

/**
 * Sets up group search on NgxMatSelectSearch element.
 */
@Directive({
  selector: '[appGroupSearch]',
  exportAs: 'groupSearch',
})
export class GroupSearchDirective implements OnInit, OnDestroy {
  filteredGroups: Observable<GroupSearchItem[]>;

  private _filteredGroups = new BehaviorSubject<GroupSearchItem[]>([]);
  private _filterCtrl = new FormControl();
  private _destroy$ = new Subject<void>();

  constructor(
    private _host: MatSelectSearchComponent,
    private _groupService: GroupService,
    private _cd: ChangeDetectorRef
  ) {
    this.filteredGroups = this._filteredGroups.asObservable();
  }

  ngOnInit(): void {
    this._createGroupFilterSub();

    // Sets descriptive labels and filter form control.
    this._host._formControl = this._filterCtrl;
    this._host.placeholderLabel = $localize`:placeholder:Select group by name...`;
    this._host.noEntriesFoundLabel = $localize`:fallback text:No groups found`;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Observes filter control value changes and fetches groups based on value.
   * Waits a defined debounce time after each input to optimize loading.
   */
  private _createGroupFilterSub(): void {
    this._filterCtrl.valueChanges
      .pipe(takeUntil(this._destroy$), debounceTime(SEARCH_DEBOUNCE_TIME))
      .subscribe((filter) => {
        this._fetchGroups(filter);
      });
  }

  /**
   * Fetches groups from the backend based on filter value and emits them from the output stream.
   *
   * @param filter Filter value.
   */
  private _fetchGroups(filter: string): void {
    const httpParams = new HttpParams().set('filter', filter);
    this._host.searching = true;
    this._cd.detectChanges();

    this._groupService
      .fetchItems<Group>(httpParams)
      .pipe(first())
      .subscribe((data) => {
        this._filteredGroups.next(
          data.items.map((item) => ({
            id: item.id,
            group:
              item.name + (item.description ? ` (${item.description})` : ''),
          }))
        );
        this._host.searching = false;
        this._cd.detectChanges();
      });
  }
}
