import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, first, switchMap, tap } from 'rxjs/operators';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ReservationsDataSource } from 'src/app/modules/shongo-table/data-sources/reservations.datasource';
import { AlertType } from 'src/app/shared/models/enums/alert-type.enum';
import { Interval } from 'src/app/shared/models/interfaces/interval.interface';
import { ResourceUtilizationDetail } from 'src/app/shared/models/rest-api/resource-utilization-detail.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';

@Component({
  selector: 'app-resource-utilization-detail-page',
  templateUrl: './resource-utilization-detail-page.component.html',
  styleUrls: ['./resource-utilization-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceUtilizationDetailPageComponent implements OnInit {
  readonly AlertType = AlertType;
  readonly loading$ = new BehaviorSubject(false);

  reservationsDataSource?: ReservationsDataSource;
  data$?: Observable<ResourceUtilizationDetail>;

  private _interval?: Interval;

  constructor(
    private _route: ActivatedRoute,
    private _resourceService: ResourceService,
    private _datePipe: MomentDatePipe
  ) {}

  ngOnInit(): void {
    this.loading$.next(true);

    this.data$ = this._route.queryParams.pipe(
      tap((params) => {
        this._interval = {
          start: params.interval_from,
          end: params.interval_to,
        };
      }),
      switchMap((params) =>
        this._resourceService.fetchResourceUtilization(
          params.resource_id,
          params.interval_from,
          params.interval_to
        )
      ),
      tap((data) => {
        this.reservationsDataSource = new ReservationsDataSource(
          data.reservations,
          this._datePipe
        );
        this.loading$.next(false);
      }),
      catchError((err) => {
        this.loading$.next(false);
        throw err;
      }),
      first()
    );
  }

  /**
   * Gets utilization interval as a localized and delimited readable string.
   *
   * @returns Interval string.
   */
  getInterval(): string {
    if (!this._interval) {
      throw new Error('Interval not defined');
    }

    const { start, end } = this._interval;

    if (start === end) {
      return this._datePipe.transform(start);
    }
    return (
      this._datePipe.transform(start, 'LLL') +
      ' - ' +
      this._datePipe.transform(end, 'LLL')
    );
  }

  /**
   * Gets resource usage as a formatted string.
   *
   * @param totalCapacity Total capacity of resource.
   * @param usedCapacity Used capacity of resource.
   * @returns Resource usage string.
   */
  getUsage(totalCapacity: number, usedCapacity: number): string {
    const percentage = Math.round((usedCapacity / totalCapacity) * 100);
    return `${usedCapacity}/${totalCapacity} (${percentage}%)`;
  }
}
