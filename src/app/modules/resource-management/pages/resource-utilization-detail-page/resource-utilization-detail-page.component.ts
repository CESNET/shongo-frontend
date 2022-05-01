import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, first, switchMap, tap } from 'rxjs/operators';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ReservationsDataSource } from 'src/app/modules/shongo-table/data-sources/reservations.datasource';
import { AlertType } from 'src/app/shared/models/enums/alert-type.enum';
import { ResourceUtilizationDetail } from 'src/app/shared/models/rest-api/resource-utilization-detail.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';

@Component({
  selector: 'app-resource-utilization-detail-page',
  templateUrl: './resource-utilization-detail-page.component.html',
  styleUrls: ['./resource-utilization-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceUtilizationDetailPageComponent implements OnInit {
  reservationsDataSource: ReservationsDataSource | undefined;
  data$: Observable<ResourceUtilizationDetail> | undefined;
  loading$ = new BehaviorSubject(false);

  readonly AlertType = AlertType;

  constructor(
    private _route: ActivatedRoute,
    private _resourceService: ResourceService,
    private _datePipe: MomentDatePipe
  ) {}

  ngOnInit(): void {
    this.loading$.next(true);
    this.data$ = this._route.queryParams.pipe(
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

  getInterval(intervalFrom: string, intervalTo: string): string {
    if (intervalFrom === intervalTo) {
      return this._datePipe.transform(intervalFrom);
    }
    return (
      this._datePipe.transform(intervalFrom, 'LLL') +
      ' - ' +
      this._datePipe.transform(intervalTo, 'LLL')
    );
  }

  getUsage(totalCapacity: number, usedCapacity: number): string {
    const percentage = Math.round((usedCapacity / totalCapacity) * 100);
    return `${usedCapacity}/${totalCapacity} (${percentage}%)`;
  }
}
