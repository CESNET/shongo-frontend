import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  ViewChild,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { DataTableDataSource } from './data-source/data-table-datasource';
import { HasID } from './models/has-id.interface';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DataTableComponent<T extends HasID> implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<T>;
  @Input() dataSource!: DataTableDataSource<T>;
  @Input() showCheckboxes!: boolean;

  selection = new SelectionModel<T>(true, []);
  maxCellTextLength = 21;

  constructor(private _breakpointObserver: BreakpointObserver) {}

  get displayedColNames(): string[] {
    const displayedColNames = [...this.dataSource.getColumnNames()];

    const smallScreen =
      this._breakpointObserver.isMatched('(max-width: 768px)');
    if (!smallScreen) {
      displayedColNames.push('select');
    }

    if (this.dataSource.buttons && this.dataSource.buttons.length > 0) {
      displayedColNames.push('actions');
    }

    return displayedColNames;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
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
}
