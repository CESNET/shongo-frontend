import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { URL_ALIASES } from '@app/shared/models/constants/url-aliases.const';
import { TagType } from '@app/shared/models/enums/tag-type.enum';
import { NotifyEmailTag, Tag } from '@app/shared/models/rest-api/tag.interface';
import { BehaviorSubject } from 'rxjs';
import { StateProps } from 'src/app/modules/shongo-table/column-components/state-chip-column/state-chip-column.component';
import { ModificationHistoryDataSource } from 'src/app/modules/shongo-table/data-sources/modification-history.datasource';
import resReqPropsMap from 'src/app/modules/shongo-table/models/maps/reservation-request-state-props.map';
import { ReservationRequestStateHelpComponent } from 'src/app/shared/components/state-help/wrapper-components/reservation-request-state-help.component';
import { AliasType } from 'src/app/shared/models/enums/alias-type.enum';
import { AllocationState } from 'src/app/shared/models/enums/allocation-state.enum';
import {
  MonthlyPeriodicityType,
  PeriodicityType,
} from 'src/app/shared/models/enums/periodicity-type.enum';
import { ReservationRequestState } from 'src/app/shared/models/enums/reservation-request-state.enum';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { aliasTypeMap } from 'src/app/shared/models/maps/alias-type.map';
import {
  Periodicity,
  RequestModification,
  ReservationRequestDetail,
} from 'src/app/shared/models/rest-api/reservation-request.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { virtualRoomResourceConfig } from 'src/config/virtual-room-resource.config';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationDetailComponent implements OnInit {
  @Input() reservationRequest!: ReservationRequestDetail;
  @Input() tags?: Tag[];

  modificationHistoryDataSource?: ModificationHistoryDataSource;
  currentRequest$!: BehaviorSubject<ReservationRequestDetail>;

  notifyEmailsTags: NotifyEmailTag[] = [];

  readonly ReservationType = ReservationType;
  readonly PeriodicityType = PeriodicityType;
  readonly Technology = Technology;
  readonly AllocationState = AllocationState;
  readonly technologyMap = virtualRoomResourceConfig.technologyNameMap;

  readonly requestTypeMap = new Map([
    [
      ReservationType.PHYSICAL_RESOURCE,
      $localize`:resource type:Physical resource`,
    ],
    [ReservationType.VIRTUAL_ROOM, $localize`:resource type:Virtual room`],
    [ReservationType.ROOM_CAPACITY, $localize`:resource type:Room capacity`],
  ]);
  readonly urlAliases = URL_ALIASES;

  constructor(private _datePipe: MomentDatePipe, private _dialog: MatDialog) {}

  ngOnInit(): void {
    this.modificationHistoryDataSource = new ModificationHistoryDataSource(
      this.reservationRequest.history,
      this._datePipe,
      this.openModification,
      this.isRowSelected
    );

    this.currentRequest$ = new BehaviorSubject<ReservationRequestDetail>(
      this.reservationRequest
    );

    this.notifyEmailsTags = this.tags?.filter(
      ({ type }) => type === TagType.NOTIFY_EMAIL
    ) as NotifyEmailTag[];
  }

  /**
   * Gets weekly periodicity in readable form.
   *
   * @param periodicity Weekly periodicity.
   * @returns Periodicity string.
   */
  getWeeklyPeriodicityString(periodicity: Periodicity): string {
    const daysString = periodicity.periodicDaysInWeek
      ?.map((day) => String(day).toLowerCase())
      .join(', ');
    return $localize`:periodicity:Every ${periodicity.periodicityCycle}. week on ${daysString}`;
  }

  /**
   * Gets monthly periodicity in readable form.
   *
   * @param periodicity Monthly periodicity.
   * @returns Periodicity string.
   */
  getMonthlyPeriodicityString(periodicity: Periodicity): string {
    if (
      periodicity.monthlyPeriodicityType === MonthlyPeriodicityType.STANDARD
    ) {
      return $localize`:periodicity:Every ${periodicity.periodicityCycle}. month`;
    } else {
      const dayOrder =
        periodicity.periodicityDayOrder === -1
          ? $localize`:option|Last {day}:last`
          : `${periodicity.periodicityDayOrder}.`;
      const day = String(periodicity.periodicDayInMonth).toLocaleLowerCase();
      return $localize`:periodicity:Every ${dayOrder} ${day} in every ${periodicity.periodicityCycle}. month`;
    }
  }

  /**
   * Gets state properties.
   *
   * @param state Reservation request state.
   * @returns State properties or null.
   */
  getStateProps(state: ReservationRequestState): StateProps | undefined {
    return resReqPropsMap.get(state);
  }

  /**
   * Gets a readable display name for alias type.
   *
   * @param type Alias type.
   * @returns Alias display name.
   */
  getAliasDisplayType(type: AliasType): string {
    return aliasTypeMap.get(type) ?? $localize`:fallback text:Unknown`;
  }

  /**
   * Determines whether periodicity should be shown.
   *
   * @returns True if periodicity should be shown, else false.
   */
  isPeriodicityShown(): boolean {
    if (this.reservationRequest.type === ReservationType.PHYSICAL_RESOURCE) {
      return (
        this.reservationRequest.physicalResourceData?.periodicity !== undefined
      );
    } else if (this.reservationRequest.type === ReservationType.ROOM_CAPACITY) {
      return (
        this.reservationRequest.virtualRoomData?.technology !==
          Technology.FREEPBX &&
        this.reservationRequest.roomCapacityData?.periodicity !== undefined
      );
    } else {
      return false;
    }
  }

  /**
   * Opens state help dialog.
   */
  openStateHelp(): void {
    this._dialog.open(ReservationRequestStateHelpComponent);
  }

  /**
   * Loads reservation request modification.
   *
   * @param id ID of request modification.
   */
  openModification = (id: string): void => {
    const modification = this.reservationRequest.history.find(
      (request) => request.id === id
    );
    const currentRequestCopy = JSON.parse(
      JSON.stringify(this.reservationRequest)
    );
    const modifiedRequest = Object.assign(currentRequestCopy, modification);

    this.currentRequest$.next(modifiedRequest);
  };

  /**
   * Determines whether a request modification in request modification table is currently selected.
   *
   * @param row Request modification.
   * @returns True if request modification is selected, else false.
   */
  isRowSelected = (row: RequestModification): boolean => {
    return this.currentRequest$.value.id === row.id;
  };
}
