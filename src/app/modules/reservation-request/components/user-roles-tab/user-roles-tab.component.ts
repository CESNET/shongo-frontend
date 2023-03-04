import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { UserRolesDataSource } from 'src/app/modules/shongo-table/data-sources/user-roles.datasource';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';

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
    private _datePipe: MomentDatePipe,
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
