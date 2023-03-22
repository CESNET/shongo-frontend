import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { RuntimeManagementDataSource } from 'src/app/modules/shongo-table/data-sources/runtime-management.datasource';

@Component({
  selector: 'app-runtime-management-tab',
  templateUrl: './runtime-management-tab.component.html',
  styleUrls: ['./runtime-management-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RuntimeManagementTabComponent implements OnInit {
  runtimeManagementDataSource?: RuntimeManagementDataSource;

  constructor(
    private _resReqService: ReservationRequestService,
    private _route: ActivatedRoute,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.runtimeManagementDataSource = new RuntimeManagementDataSource(
      this._resReqService,
      this._dialog,
      this._route.snapshot.params.id
    );
  }
}
