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
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { virtualRoomResourceConfig } from 'src/config/virtual-room-resource.config';
import { Option } from 'src/app/shared/models/interfaces/option.interface';
import {
  DataTableFilter,
  TableSettings,
} from 'src/app/modules/shongo-table/filter/data-table-filter';

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
  });

  readonly technologyOptions: Option[];

  private _destroy$ = new Subject<void>();

  constructor(private _resourceService: ResourceService) {
    super();
    this.technologyOptions = this._getTechnologyOpts();
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
    } = this.filterForm.value;

    if (technology && technology !== -1) {
      httpParams = httpParams.append('technology', technology);
    }
    if (dateFrom) {
      const date = moment(dateFrom).toISOString();
      httpParams = httpParams.append('interval_from', date);
    }
    if (dateTo) {
      const date = moment(dateTo).toISOString();
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

    return httpParams;
  }

  getTableSettings(): TableSettings {
    return {};
  }

  private _getTechnologyOpts(): Option[] {
    const technologies = this._resourceService.getVirtualRoomTechnologies();

    const technologyOpts = technologies
      .map((technology) => ({
        value: technology,
        displayName:
          virtualRoomResourceConfig.technologyNameMap.get(technology),
      }))
      .filter((opt) => opt.displayName) as Option[];
    technologyOpts.unshift({
      value: '-1',
      displayName: $localize`:selection option|All available options:All`,
    });

    return technologyOpts;
  }
}
