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
    this._createUserFilterSub();

    this._host._formControl = this._filterCtrl;
    this._host.placeholderLabel = $localize`:placeholder:Select group by name...`;
    this._host.noEntriesFoundLabel = $localize`:fallback text:No groups found`;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _createUserFilterSub(): void {
    this._filterCtrl.valueChanges
      .pipe(takeUntil(this._destroy$), debounceTime(SEARCH_DEBOUNCE_TIME))
      .subscribe((filter) => {
        this._fetchUsers(filter);
      });
  }

  private _fetchUsers(filter: string): void {
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
