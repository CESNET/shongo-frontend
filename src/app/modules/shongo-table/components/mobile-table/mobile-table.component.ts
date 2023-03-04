import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/core/services/alert.service';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { TableColumn } from '../../models/table-column.interface';
import { GenericTableComponent } from '../generic-table';
import { MobileSort } from './mobile-sort';

@Component({
  selector: 'app-mobile-table',
  templateUrl: './mobile-table.component.html',
  styleUrls: ['./mobile-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileTableComponent<T>
  extends GenericTableComponent<T>
  implements OnInit, AfterViewInit, OnDestroy
{
  readonly items$ = new BehaviorSubject<T[]>([]);
  mobileSort = new MobileSort();

  readonly sortForm = new FormGroup({
    active: new FormControl(''),
    direction: new FormControl(''),
  });

  constructor(
    protected _cd: ChangeDetectorRef,
    protected _injector: Injector,
    protected _alert: AlertService,
    protected _dialog: MatDialog
  ) {
    super(_cd, _injector, _alert, _dialog);
  }

  get data(): ApiResponse<T> | undefined {
    return this.dataSource.data;
  }

  get columns(): TableColumn<T>[] {
    return this.dataSource.displayedColumns;
  }

  get loadingData$(): Observable<boolean> {
    return this.dataSource.loading$;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this._observeMobileSort();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.dataSource.mobileSort = this.mobileSort;
    this._connectDataSource();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dataSource.disconnect();
  }

  /**
   * Returns data for a given row.
   *
   * @param item Table item.
   * @param rowName Row name (column name in standard table).
   * @returns Row data.
   */
  getRowData(item: T, rowName: string): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowData = (item as any)[rowName];
    return rowData ? String(rowData) : undefined;
  }

  /**
   * Connects data source to mobile table.
   */
  private _connectDataSource(): void {
    this.dataSource
      .connect()
      .pipe(takeUntil(this._destroy$))
      .subscribe((items) => this.items$.next(items));
  }

  /**
   * Observes sort form value changes and updates mobile sort.
   */
  private _observeMobileSort(): void {
    this.sortForm.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((sort) => this.mobileSort.changeSort(sort));
  }
}
