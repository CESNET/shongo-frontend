import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Directive, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectSearchComponent } from 'ngx-mat-select-search';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, first, takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/core/http/user/user.service';
import { SEARCH_DEBOUNCE_TIME } from '../../config/search-debounce-time';
import { User } from '../../models/rest-api/user.interface';

export interface UserSearchItem {
  id: string;
  user: string;
}

/**
 * Sets up user search on NgxMatSelectSearch element.
 */
@Directive({
  selector: '[appUserSearch]',
  exportAs: 'userSearch',
})
export class UserSearchDirective implements OnInit, OnDestroy {
  filteredUsers: Observable<UserSearchItem[]>;

  private _filteredUsers = new BehaviorSubject<UserSearchItem[]>([]);
  private _filterCtrl = new FormControl();
  private _destroy$ = new Subject<void>();

  constructor(
    private _host: MatSelectSearchComponent,
    private _userService: UserService,
    private _cd: ChangeDetectorRef
  ) {
    this.filteredUsers = this._filteredUsers.asObservable();
  }

  ngOnInit(): void {
    this._createUserFilterSub();

    this._host._formControl = this._filterCtrl;
    this._host.placeholderLabel = $localize`:placeholder:Select user by name/e-mail...`;
    this._host.noEntriesFoundLabel = $localize`:fallback text:No users found`;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Observes filter control value changes and fetches users based on value.
   * Waits a defined debounce time after each input to optimize loading.
   */
  private _createUserFilterSub(): void {
    this._filterCtrl.valueChanges
      .pipe(takeUntil(this._destroy$), debounceTime(SEARCH_DEBOUNCE_TIME))
      .subscribe((filter) => {
        if (filter.length > 1) {
          this._fetchUsers(filter);
        }
      });
  }

  /**
   * Fetches users from the backend based on filter value and emits them from the output stream.
   *
   * @param filter Filter value.
   */
  private _fetchUsers(filter: string): void {
    const httpParams = new HttpParams().set('filter', filter);
    this._host.searching = true;
    this._cd.detectChanges();

    this._userService
      .fetchItems<User>(httpParams)
      .pipe(first())
      .subscribe((data) => {
        this._filteredUsers.next(
          data.items.map((item) => ({
            id: item.userId,
            user:
              item.fullName +
              (item.organization ? ` (${item.organization})` : ''),
          }))
        );
        this._host.searching = false;
        this._cd.detectChanges();
      });
  }
}
