import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DataTableDataSource } from '../../data-sources/data-table-datasource';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T> implements OnDestroy {
  @Input() dataSource!: DataTableDataSource<T>;
  @Input() showCheckboxes = true;
  @Input() description: string = '';
  @Input() showDeleteButtons = true;

  readonly tabletSizeHit$: Observable<BreakpointState>;

  private readonly _destroy$ = new Subject<void>();

  constructor(private _br: BreakpointObserver) {
    this.tabletSizeHit$ = this._createTabletSizeHit$();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _createTabletSizeHit$(): Observable<BreakpointState> {
    return this._br
      .observe('(max-width: 768px)')
      .pipe(takeUntil(this._destroy$));
  }
}
