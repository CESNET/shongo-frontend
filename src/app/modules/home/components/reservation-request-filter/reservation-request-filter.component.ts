import { HttpParams } from '@angular/common/http';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import {
  DataTableFilter,
  TableSettings,
} from '../../../../shared/components/data-table/filter/data-table-filter';

@Component({
  selector: 'app-reservation-request-filter',
  templateUrl: './reservation-request-filter.component.html',
  styleUrls: ['./reservation-request-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationRequestFilterComponent
  extends DataTableFilter
  implements OnInit, OnDestroy
{
  showAdvancedFilter = false;

  filterForm = new FormGroup({
    technology: new FormControl(-1),
    dateFrom: new FormControl(null),
    dateTo: new FormControl(null),
    user: new FormControl(null),
    participant: new FormControl(null),
    search: new FormControl(null),
    showFailedRooms: new FormControl(true),
    showCapacity: new FormControl(true),
  });

  technologyOptions = [
    { name: 'All', value: -1 },
    { name: 'Videoconference (PEXIP)', value: Technology.PEXIP },
    {
      name: 'Webconference (Adobe Connect)',
      value: Technology.ADOBE_CONNECT,
    },
    { name: 'Teleconference', value: Technology.FREEPBX },
    { name: 'Videoconference (MCU)', value: Technology.H323_SIP },
  ];

  private _destroy$ = new Subject<void>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.emitHttpQuery();
    this.filterForm.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.emitHttpQuery());
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  toggleAdvancedFilter(): void {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }

  getHttpQuery(): HttpParams {
    let httpParams = new HttpParams();
    const {
      technology,
      dateFrom,
      dateTo,
      user,
      participant,
      search,
      showFailedRooms,
      showCapacity,
    } = this.filterForm.value;

    if (technology && technology !== -1) {
      httpParams = httpParams.append('technology', technology);
    }
    if (dateFrom) {
      const date = moment(dateFrom).unix();
      httpParams = httpParams.append('interval_from', date);
    }
    if (dateTo) {
      const date = moment(dateTo).unix();
      httpParams = httpParams.append('interval_to', date);
    }
    if (user) {
      httpParams = httpParams.append('user', user);
    }
    if (participant) {
      httpParams = httpParams.append('participant', participant);
    }
    if (search) {
      httpParams = httpParams.append('search', search);
    }
    if (!showFailedRooms) {
      httpParams = httpParams.append('no_failed', true);
    }
    if (showCapacity) {
      httpParams = httpParams.append('with_capacity', true);
    }

    return httpParams;
  }

  getTableSettings(): TableSettings {
    return {};
  }
}
