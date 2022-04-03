import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  Component,
  ViewChild,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  OnInit,
  ContentChild,
  Injector,
  ChangeDetectorRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { DataTableDataSource } from './data-sources/data-table-datasource';
import { DataTableFilter } from './filter/data-table-filter';
import { TableButton } from './buttons/table-button';
import { ApiActionButton } from './buttons/api-action-button';
import { LinkButton } from './buttons/link-button';
import { TableButtonType } from '../../models/enums/table-button-type.enum';
import { ActionButton } from './buttons/action-button';
import {
  SETTINGS_PROVIDER,
  COL_DATA_PROVIDER,
} from './column-components/column.component';
import { FormControl, FormGroup } from '@angular/forms';
import { StaticDataSource } from './data-sources/static-datasource';
import { AlertService } from 'src/app/core/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { CertainityCheckComponent } from '../certainity-check/certainity-check.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  @ContentChild('tableFilter') filter: DataTableFilter | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<T>;
  @Input() dataSource!: DataTableDataSource<T>;
  @Input() showCheckboxes = true;
  @Input() description: string = '';
  @Input() showDeleteButtons = true;
  @Input() fixedLayout = false;

  TableButtonType = TableButtonType;
  selection = new SelectionModel<T>(true, []);
  maxCellTextLength = 21;
  displayedColumns: Observable<string[]>;

  sortForm = new FormGroup({
    field: new FormControl(''),
    order: new FormControl('asc'),
  });

  private _displayedColumns = new BehaviorSubject<string[]>([]);
  private _destroy$ = new Subject<void>();

  // Prevents infinite loops of changing sort in the form and the header.
  private _sortChangeMutex = true;

  constructor(
    private _injector: Injector,
    private _cd: ChangeDetectorRef,
    private _alert: AlertService,
    private _dialog: MatDialog
  ) {
    this.displayedColumns = this._displayedColumns.asObservable();
  }

  get showRefreshButton(): boolean {
    return this.dataSource && !(this.dataSource instanceof StaticDataSource);
  }

  ngOnInit(): void {
    this._observeLoading();
    this._displayedColumns.next(this._buildDisplayedColumnsArray());
    this.sortForm.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        filter(() => this._sortChangeMutex)
      )
      .subscribe(({ field, order }) => {
        if (field) {
          this._sortChangeMutex = false;
          const sortable = this.sort.sortables.get(field)!;
          sortable.start = order;
          const dir = this.sort.getNextSortDirection(sortable);
          this.sort.sort(sortable);

          // Skip the no direction option
          if (dir === '') {
            this.sort.sort(sortable);
          }
          this._sortChangeMutex = true;
        }
      });
    this.maxCellTextLength = Math.round(
      150 / this._displayedColumns.value.length
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.filter$ = this.filter?.httpQuery$;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

    this.sort.sortChange
      .pipe(
        takeUntil(this._destroy$),
        filter(() => this._sortChangeMutex)
      )
      .subscribe(({ active, direction }) => {
        this._sortChangeMutex = false;
        const { field, order } = this.sortForm.value as Record<string, string>;

        if (field !== active) {
          this.sortForm.get('field')!.setValue(active);
        }
        if (order !== direction) {
          this.sortForm.get('order')!.setValue(direction);
        }
        this._sortChangeMutex = true;
      });

    // Needed to detect changes in custom components.
    this.filter?.settings$
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this._cd.detectChanges());
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  asApiActionButton(button: TableButton<T>): ApiActionButton<T> {
    return button as ApiActionButton<T>;
  }

  asLinkButton(button: TableButton<T>): LinkButton<T> {
    return button as LinkButton<T>;
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

  getButtonType(button: TableButton<T>): TableButtonType {
    if (button instanceof ApiActionButton) {
      return TableButtonType.API_ACTION;
    } else if (button instanceof LinkButton) {
      return TableButtonType.LINK;
    }
    return TableButtonType.ACTION;
  }

  handleButtonClick(button: TableButton<T>, row: T): void {
    if (button instanceof ActionButton) {
      button
        .executeAction(row)
        .pipe(first())
        .subscribe({
          next: (msg) => {
            if (msg) {
              this._alert.showSuccess(msg);
            }
          },
          error: (msg) => {
            this._alert.showError(msg);
          },
        });
    }
  }

  createColComponentValueInjector(row: T, columnName: string): Injector {
    const tableSettings = this.filter?.settings$;
    return Injector.create({
      providers: [
        { provide: COL_DATA_PROVIDER, useValue: { row, columnName } },
        { provide: SETTINGS_PROVIDER, useValue: tableSettings },
      ],
      parent: this._injector,
    });
  }

  getTooltip(cellData: string): string {
    return (cellData && cellData.length) > this.maxCellTextLength
      ? cellData
      : '';
  }

  filterDisplayedButtons(row: T): TableButton<T>[] {
    return this.dataSource.buttons.filter((button) =>
      button.displayButtonFunc ? button.displayButtonFunc(row) : true
    );
  }

  deleteSelectedRows(): void {
    if (!this.dataSource.apiService) {
      console.error($localize`No api service defined in table's datasource`);
      return this._alert.showError(
        $localize`Mass deletion is not available for this table`
      );
    } else if (!this.selection || this.selection.isEmpty()) {
      return this._alert.showWarning('No rows were selected');
    } else if (!this.selection.selected.every((item) => 'id' in item)) {
      console.error($localize`All selected rows must have an id`);
      return this._alert.showError(
        $localize`All selected rows must have an id`
      );
    }

    this._dialog
      .open(CertainityCheckComponent, {
        data: {
          message: $localize`Are you sure you want to delete selected rows?`,
        },
      })
      .afterClosed()
      .pipe(first())
      .subscribe((shouldDelete) => {
        if (shouldDelete) {
          const selected = this.selection.selected as (T & { id: string })[];
          this.dataSource
            .apiService!.deleteItems(selected.map((row) => row.id))
            .pipe(first())
            .subscribe({
              next: () => {
                this._alert.showSuccess($localize`Items deleted successfully.`);
                this.dataSource.refreshData();
              },
              error: (err) => {
                console.error(err);
                this._alert.showError(
                  $localize`Failed to delete selected rows.`
                );
              },
            });
        }
      });
  }

  deleteAllRows(): void {
    if (!this.dataSource.apiService) {
      console.error($localize`No api service defined in table's datasource`);
      return this._alert.showError(
        $localize`Mass deletion is not available for this table`
      );
    } else if (this.dataSource.data.count === 0) {
      return this._alert.showWarning($localize`Table is empty`);
    }

    this._dialog
      .open(CertainityCheckComponent, {
        data: { message: $localize`Are you sure you want to delete all rows?` },
      })
      .afterClosed()
      .pipe(first())
      .subscribe((shouldDelete) => {
        if (shouldDelete) {
          this.dataSource
            .apiService!.deleteItems()
            .pipe(first())
            .subscribe({
              next: () => {
                this._alert.showSuccess($localize`Rows deleted successfully.`);
                this.dataSource.refreshData();
              },
              error: (err) => {
                console.error(err);
                this._alert.showError($localize`Failed to delete all rows.`);
              },
            });
        }
      });
  }

  private _buildDisplayedColumnsArray(): string[] {
    const displayedColumns = [...this.dataSource.getColumnNames()];

    if (this.dataSource.buttons && this.dataSource.buttons.length !== 0) {
      displayedColumns.push('actions');
    }

    if (this.showCheckboxes) {
      displayedColumns.push('select');
    }

    return displayedColumns;
  }

  private _observeLoading(): void {
    this.dataSource.loading$
      .pipe(
        takeUntil(this._destroy$),
        filter((loading) => !loading)
      )
      .subscribe(() => this.selection.clear());
  }
}
