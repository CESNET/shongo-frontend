import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from '@angular/core';
import {
  MonthlyPeriodicityType,
  PeriodicityType,
} from 'src/app/shared/models/enums/periodicity-type.enum';
import {
  Periodicity,
  RequestModification,
  ReservationRequestDetail,
} from 'src/app/shared/models/rest-api/reservation-request.interface';
import resReqPropsMap from 'src/app/shared/components/data-table/models/maps/reservation-request-state-props.map';
import { StateProps } from 'src/app/shared/components/data-table/column-components/state-chip-column/state-chip-column.component';
import { ModificationHistoryDataSource } from 'src/app/shared/components/data-table/data-sources/modification-history.datasource';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { first } from 'rxjs/operators';
import { ReservationRequestState } from 'src/app/shared/models/enums/reservation-request-state.enum';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { AllocationState } from 'src/app/shared/models/enums/allocation-state.enum';
import { AliasType } from 'src/app/shared/models/enums/alias-type.enum';
import { aliasTypeMap } from 'src/app/shared/models/maps/alias-type.map';
import { technologyMap } from 'src/app/shared/models/maps/technology.map';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationDetailComponent implements OnInit {
  @Input() reservationRequest!: ReservationRequestDetail;

  modificationHistoryDataSource?: ModificationHistoryDataSource;
  ReservationType = ReservationType;
  PeriodicityType = PeriodicityType;
  Technology = Technology;
  AllocationState = AllocationState;
  technologyMap = technologyMap;

  requestTypeMap = new Map([
    [ReservationType.PHYSICAL_RESOURCE, 'Physical resource'],
    [ReservationType.VIRTUAL_ROOM, 'Virtual room'],
    [ReservationType.ROOM_CAPACITY, 'Room capacity'],
  ]);
  currentRequest!: ReservationRequestDetail;

  constructor(
    private _datePipe: MomentDatePipe,
    private _resReqService: ReservationRequestService
  ) {}

  ngOnInit(): void {
    this.modificationHistoryDataSource = new ModificationHistoryDataSource(
      this.reservationRequest.history,
      this._datePipe,
      this.openModification,
      this.isRowSelected
    );
    this.currentRequest = this.reservationRequest;
  }

  getWeeklyPeriodicityString(periodicity: Periodicity): string {
    const daysString = periodicity.periodicDaysInWeek
      ?.map((day) => String(day).toLowerCase())
      .join(', ');
    return `Every ${periodicity.periodicityCycle}. week on ${daysString}`;
  }

  getMonthlyPeriodicityString(periodicity: Periodicity): string {
    if (
      periodicity.monthlyPeriodicityType === MonthlyPeriodicityType.STANDARD
    ) {
      return `Every ${periodicity.periodicityCycle}. month`;
    } else {
      const dayOrder =
        periodicity.periodicityDayOrder === -1
          ? 'last'
          : `${periodicity.periodicityDayOrder}.`;
      const day = String(periodicity.periodicDayInMonth).toLocaleLowerCase();
      return `Every ${dayOrder} ${day} in every ${periodicity.periodicityCycle}. month`;
    }
  }

  getStateProps(state: ReservationRequestState): StateProps | undefined {
    return resReqPropsMap.get(state);
  }

  getAliasDisplayType(type: AliasType): string {
    return aliasTypeMap.get(type) ?? 'Unknown';
  }

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

  openModification = (id: string): void => {
    this._resReqService
      .fetchItem<ReservationRequestDetail>(id)
      .pipe(first())
      .subscribe((request) => (this.currentRequest = request));
  };

  isRowSelected = (row: RequestModification): boolean => {
    return this.currentRequest.id === row.id;
  };
}
