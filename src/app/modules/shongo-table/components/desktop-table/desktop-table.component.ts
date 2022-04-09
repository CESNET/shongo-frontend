import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  Injector,
  Input,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AlertService } from 'src/app/core/services/alert.service';
import { GenericTableComponent } from '../../generic-table';

@Component({
  selector: 'app-desktop-table',
  templateUrl: './desktop-table.component.html',
  styleUrls: ['./desktop-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopTableComponent<T>
  extends GenericTableComponent<T>
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatTable) table!: MatTable<T>;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() fixedLayout = false;

  maxCellTextLength = 50;

  constructor(
    protected _cd: ChangeDetectorRef,
    protected _injector: Injector,
    protected _alert: AlertService,
    protected _dialog: MatDialog
  ) {
    super(_cd, _injector, _alert, _dialog);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
    this.maxCellTextLength = this._calcMaxCellLength();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  private _calcMaxCellLength(): number {
    return Math.round(300 / this._displayedColumns.value.length);
  }
}
