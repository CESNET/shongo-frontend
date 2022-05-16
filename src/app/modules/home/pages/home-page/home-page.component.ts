import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { RoomService } from 'src/app/core/http/room/room.service';
import { ParticipationInRoomsDataSource } from 'src/app/modules/shongo-table/data-sources/participation-in-rooms.datasource';
import { PhysicalReservationsDataSource } from 'src/app/modules/shongo-table/data-sources/physical-reservations.datasource';
import { YourRoomsDataSource } from 'src/app/modules/shongo-table/data-sources/your-rooms.datasource';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit, OnDestroy {
  readonly yourRoomsDataSource: YourRoomsDataSource;
  readonly physicalReservationsDataSource: PhysicalReservationsDataSource;
  readonly participationInRoomsDataSource: ParticipationInRoomsDataSource;

  tabIndex = 0;

  private readonly _destroy$ = new Subject<void>();

  constructor(
    private _resReqService: ReservationRequestService,
    private _roomService: RoomService,
    private _datePipe: MomentDatePipe,
    private _route: ActivatedRoute,
    private _router: Router,
    private _dialog: MatDialog,
    public auth: AuthenticationService
  ) {
    this.yourRoomsDataSource = new YourRoomsDataSource(
      this._resReqService,
      this._datePipe,
      this._dialog
    );
    this.physicalReservationsDataSource = new PhysicalReservationsDataSource(
      this._resReqService,
      this._datePipe,
      this._dialog
    );
    this.participationInRoomsDataSource = new ParticipationInRoomsDataSource(
      this._roomService,
      this._datePipe
    );
  }

  ngOnInit(): void {
    // Try reading tab index from query string and set it in mat tab group.
    this._route.queryParamMap
      .pipe(takeUntil(this._destroy$))
      .subscribe((params) => {
        const tabIndex = params.get('tabIndex');

        if (tabIndex) {
          const tabIndexNum = Number(tabIndex);

          if (tabIndexNum !== NaN) {
            this.tabIndex = tabIndexNum;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Sets tab index into the route's query string.
   *
   * @param index Index of selected tab.
   */
  onTabIndexChange(index: number): void {
    this._router.navigate([], { queryParams: { tabIndex: String(index) } });
  }
}
