import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-mobile-table',
  templateUrl: './mobile-table.component.html',
  styleUrls: ['./mobile-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileTableComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
