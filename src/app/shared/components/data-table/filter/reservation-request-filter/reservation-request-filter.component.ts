import { HttpParams } from '@angular/common/http';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoomTechnology } from '../../models/enums/room-technology';
import { DataTableFilter } from '../data-table-filter';

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
    { name: 'Všechny', value: -1 },
    { name: 'Videokonference (PEXIP)', value: RoomTechnology.PEXIP },
    {
      name: 'Webkonference (Adobe Connect)',
      value: RoomTechnology.ADOBE_CONNECT,
    },
    { name: 'Telekonference', value: RoomTechnology.TELECONFERENCE },
    { name: 'Videokonference (MCU)', value: RoomTechnology.MCU },
  ];

  private _destroy$ = new Subject<void>();

  constructor() {
    super();
  }

  ngOnInit(): void {
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

    const technologyQuery = this._getTechnologyQuery(technology);
    if (technologyQuery) {
      httpParams = httpParams.append('technology', technologyQuery);
    }
    if (dateFrom) {
      const date = new Date(dateFrom).toISOString();
      httpParams = httpParams.append('date_from', date);
    }
    if (dateTo) {
      const date = new Date(dateTo).toISOString();
      httpParams = httpParams.append('date_to', date);
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

  private _getTechnologyQuery(technology: RoomTechnology): string | null {
    switch (technology) {
      case RoomTechnology.ADOBE_CONNECT:
        return 'adobe_connect';
      case RoomTechnology.MCU:
        return 'mcu';
      case RoomTechnology.PEXIP:
        return 'pexip';
      case RoomTechnology.TELECONFERENCE:
        return 'teleconference';
      default:
        return null;
    }
  }
}
