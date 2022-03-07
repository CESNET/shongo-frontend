import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from '@angular/core';
import { ReservationType } from 'src/app/models/enums/reservation-type.enum';
import {
  MonthlyPeriodicityType,
  PeriodicityType,
} from 'src/app/shared/models/enums/periodicity-type.enum';
import {
  Periodicity,
  RequestModification,
  ReservationRequest,
  ReservationRequestDetail,
} from 'src/app/shared/models/rest-api/reservation-request.interface';
import resReqPropsMap from 'src/app/shared/components/data-table/models/maps/reservation-request-state-props.map';
import { StateProps } from 'src/app/shared/components/data-table/column-components/state-chip-column/state-chip-column.component';
import { ReservationRequestState } from 'src/app/models/enums/reservation-request-state.enum';
import { ModificationHistoryDataSource } from 'src/app/shared/components/data-table/data-sources/modification-history.datasource';
import { DatePipe } from '@angular/common';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { first } from 'rxjs/operators';

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
  requestTypeMap = new Map([
    [ReservationType.PHYSICAL_RESOURCE, 'Physical resource'],
    [ReservationType.VIRTUAL_ROOM, 'Virtual room'],
    [ReservationType.ROOM_CAPACITY, 'Room capacity'],
  ]);
  currentRequest!: ReservationRequestDetail;

  constructor(
    private _datePipe: DatePipe,
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
