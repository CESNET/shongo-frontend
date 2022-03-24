import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-unauthorized-page',
  templateUrl: './unauthorized-page.component.html',
  styleUrls: ['./unauthorized-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
