import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  ViewChild,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataTableDataSource } from './data-source/data-table-datasource';
import { HasID } from './models/has-id.interface';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends HasID>
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<T>;
  @Input() dataSource!: DataTableDataSource<T>;
  @Input() showCheckboxes!: boolean;

  selection = new SelectionModel<T>(true, []);
  maxCellTextLength = 21;
  displayedColumns: Observable<string[]>;

  private _displayedColumns = new BehaviorSubject<string[]>([]);
  private _destroy$ = new Subject<void>();

  constructor(private _breakpointObserver: BreakpointObserver) {
    this.displayedColumns = this._displayedColumns.asObservable();
  }

  ngOnInit(): void {
    const isSmallScreen =
      this._breakpointObserver.isMatched('(max-width: 768px)');
    this._displayedColumns.next(
      this._buildDisplayedColumnsArray(!isSmallScreen)
    );

    this._watchForSmallScreen();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.count;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.items.forEach((row) => this.selection.select(row));
  }

  /**
   * Returns text for a cell tooltip. Returns empty string if text isn't longer than max text length to disable tooltip.
   *
   * @param text Text inside a table cell.
   * @returns Tooltip text.
   */
  getTooltipText(text: string): string {
    if (text.length > this.maxCellTextLength) {
      return text;
    }
    return '';
  }

  private _buildDisplayedColumnsArray(addSelect: boolean): string[] {
    const displayedColumns = [...this.dataSource.getColumnNames()];

    if (this.dataSource.buttons && this.dataSource.buttons.length > 0) {
      displayedColumns.push('actions');
    }

    if (addSelect) {
      displayedColumns.push('select');
    }

    return displayedColumns;
  }

  private _watchForSmallScreen(): void {
    this._breakpointObserver
      .observe('(max-width: 768px)')
      .pipe(takeUntil(this._destroy$))
      .subscribe((breakpoint) => {
        if (breakpoint.matches) {
          this._displayedColumns.next(this._buildDisplayedColumnsArray(false));
        } else {
          this._displayedColumns.next(this._buildDisplayedColumnsArray(true));
        }
      });
  }
}
