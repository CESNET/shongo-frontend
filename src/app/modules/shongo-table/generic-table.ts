import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/core/services/alert.service';
import { CertainityCheckComponent } from 'src/app/shared/components/certainity-check/certainity-check.component';
import { ComponentHostDirective } from 'src/app/shared/directives/component-host.directive';
import { TableButtonType } from 'src/app/shared/models/enums/table-button-type.enum';
import { ActionButton } from './buttons/action-button';
import { ApiActionButton } from './buttons/api-action-button';
import { LinkButton } from './buttons/link-button';
import { TableButton } from './buttons/table-button';
import {
  COL_DATA_PROVIDER,
  SETTINGS_PROVIDER,
} from './column-components/column.component';
import { DataTableDataSource } from './data-sources/data-table-datasource';
import { StaticDataSource } from './data-sources/static-datasource';
import { DataTableFilter } from './filter/data-table-filter';

@Component({
  template: '',
})
export abstract class GenericTableComponent<T>
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(ComponentHostDirective) filterHost?: ComponentHostDirective;
  @Input() dataSource!: DataTableDataSource<T>;
  @Input() showCheckboxes = true;
  @Input() description: string = '';
  @Input() showDeleteButtons = true;

  filter?: DataTableFilter;
  maxCellTextLength?: number;

  readonly TableButtonType = TableButtonType;
  readonly selection = new SelectionModel<T>(true, []);
  readonly displayedColumns: Observable<string[]>;

  protected _displayedColumns = new BehaviorSubject<string[]>([]);
  protected _destroy$ = new Subject<void>();

  constructor(
    protected _cd: ChangeDetectorRef,
    protected _injector: Injector,
    protected _alert: AlertService,
    protected _dialog: MatDialog
  ) {
    this.displayedColumns = this._displayedColumns.asObservable();
  }

  get showRefreshButton(): boolean {
    return this.dataSource && !(this.dataSource instanceof StaticDataSource);
  }

  ngOnInit(): void {
    this._displayedColumns.next(this._buildDisplayedColumnsArray());
    this._observeLoading();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

    // Try rendering filter
    this._renderFilterComponent();

    if (this.filter) {
      this.dataSource.filter$ = this.filter.httpQuery$;

      // Needed to detect changes in custom components.
      this.filter.settings$
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => this._cd.detectChanges());
    }
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
    if (
      this.maxCellTextLength !== undefined &&
      text.length > this.maxCellTextLength
    ) {
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

  filterDisplayedButtons(row: T): TableButton<T>[] {
    return this.dataSource.buttons.filter((button) =>
      button.displayButtonFunc ? button.displayButtonFunc(row) : true
    );
  }

  deleteSelectedRows(): void {
    if (!this.dataSource.apiService) {
      console.error(`No api service defined in table's datasource`);
      return this._alert.showError(
        $localize`:error message:Mass deletion is not available for this table`
      );
    } else if (!this.selection || this.selection.isEmpty()) {
      return this._alert.showWarning(
        $localize`:warning message:No rows were selected`
      );
    } else if (!this.selection.selected.every((item) => 'id' in item)) {
      console.error(`All selected rows must have an id`);
      return this._alert.showError(
        $localize`:error message:All selected rows must have an id`
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
                this._alert.showSuccess(
                  $localize`:success message:Items deleted`
                );
                this.dataSource.refreshData();
              },
              error: (err) => {
                console.error(err);
                this._alert.showError(
                  $localize`:error message:Failed to delete selected rows`
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
        $localize`:error message:Mass deletion is not available for this table`
      );
    } else if (this.dataSource.data.count === 0) {
      return this._alert.showWarning(
        $localize`:warning message:Table is empty`
      );
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
                this._alert.showSuccess(
                  $localize`:success message:Rows deleted`
                );
                this.dataSource.refreshData();
              },
              error: (err) => {
                console.error(err);
                this._alert.showError(
                  $localize`:error message:Failed to delete all rows`
                );
              },
            });
        }
      });
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

  private _renderFilterComponent(): void {
    if (this.filterHost && this.dataSource.filterComponent) {
      this.filterHost.viewContainerRef.clear();
      this.filter = this.filterHost.viewContainerRef.createComponent(
        this.dataSource.filterComponent
      ).instance;
    }
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
