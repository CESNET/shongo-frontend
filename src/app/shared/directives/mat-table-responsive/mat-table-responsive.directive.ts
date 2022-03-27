import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, mapTo, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appMatTableResponsive]',
})
export class MatTableResponsiveDirective implements AfterViewInit, OnDestroy {
  private onDestroy$ = new Subject<boolean>();

  private thead!: HTMLTableSectionElement;
  private tbody!: HTMLTableSectionElement;

  private theadChanged$ = new BehaviorSubject(true);
  private tbodyChanged$ = new Subject<boolean>();

  private theadObserver = new MutationObserver(() =>
    this.theadChanged$.next(true)
  );
  private tbodyObserver = new MutationObserver(() =>
    this.tbodyChanged$.next(true)
  );

  constructor(private container: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const tableElement = this.container.nativeElement.querySelector('table');
    this.thead = tableElement.querySelector('thead');
    this.tbody = tableElement.querySelector('tbody');

    this.theadObserver.observe(this.thead, {
      characterData: true,
      subtree: true,
    });
    this.tbodyObserver.observe(this.tbody, { childList: true });

    /**
     * Set the "data-column-name" attribute for every body row cell, either on
     * thead row changes (e.g. language changes) or tbody rows changes (add, delete).
     */
    combineLatest([this.theadChanged$, this.tbodyChanged$])
      .pipe(
        mapTo([this.thead.rows.item(0), this.tbody.rows] as [
          HTMLTableRowElement,
          HTMLCollectionOf<HTMLTableRowElement>
        ]),
        map(
          ([headRow, bodyRows]) =>
            [
              Array.from(headRow.children).map(
                (headerCell) => headerCell.textContent
              ),
              Array.from(bodyRows).map((row) => Array.from(row.children)),
            ] as [string[], HTMLTableCellElement[][]]
        ),
        takeUntil(this.onDestroy$)
      )
      .subscribe(([columnNames, rows]) =>
        rows.forEach((rowCells) =>
          rowCells.forEach((cell) =>
            this.renderer.setAttribute(
              cell,
              'data-column-name',
              columnNames[cell.cellIndex]
            )
          )
        )
      );
  }

  ngOnDestroy(): void {
    this.theadObserver.disconnect();
    this.tbodyObserver.disconnect();

    this.onDestroy$.next(true);
  }
}
