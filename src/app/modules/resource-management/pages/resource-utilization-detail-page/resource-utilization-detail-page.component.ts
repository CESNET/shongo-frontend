import { DatePipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, first, switchMap, tap } from 'rxjs/operators';
import { ResourceCapacityUtilizationService } from 'src/app/core/http/resource-capacity-utilization/resource-capacity-utilization.service';
import { ReservationsDataSource } from 'src/app/shared/components/data-table/data-sources/reservations.datasource';
import { ResourceUtilizationDetail } from 'src/app/shared/models/rest-api/resource-utilization-detail.interface';

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

  constructor(
    private _route: ActivatedRoute,
    private _resUtilService: ResourceCapacityUtilizationService,
    private _datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loading$.next(true);
    this.data$ = this._route.queryParams.pipe(
      switchMap((params) =>
        this._resUtilService.fetchResourceUsage(
          params.resourceId,
          params.intervalFrom,
          params.intervalTo
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
        return throwError(err);
      }),
      first()
    );
  }

  getInterval(intervalFrom: string, intervalTo: string): string {
    if (intervalFrom === intervalTo) {
      return intervalFrom;
    }
    return intervalFrom + ' - ' + intervalTo;
  }

  getUsage(totalCapacity: number, usedCapacity: number): string {
    const percentage = Math.round((usedCapacity / totalCapacity) * 100);
    return `${usedCapacity}/${totalCapacity} (${percentage}%)`;
  }
}
