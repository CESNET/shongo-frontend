import { DatePipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { UserRolesDataSource } from 'src/app/shared/components/data-table/data-sources/user-roles.datasource';

@Component({
  selector: 'app-user-roles-tab',
  templateUrl: './user-roles-tab.component.html',
  styleUrls: ['./user-roles-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRolesTabComponent implements OnInit {
  userRolesDataSource?: UserRolesDataSource;

  constructor(
    private _route: ActivatedRoute,
    private _resReqService: ReservationRequestService,
    private _datePipe: DatePipe,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._route.params.pipe(first()).subscribe((params) => {
      this.userRolesDataSource = new UserRolesDataSource(
        params.id,
        this._resReqService,
        this._datePipe,
        this._dialog
      );
    });
  }
}
