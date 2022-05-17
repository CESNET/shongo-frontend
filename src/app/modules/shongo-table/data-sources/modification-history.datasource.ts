import { SortDirection } from '@angular/material/sort';
import { Observable, of } from 'rxjs';
import { ReservationRequestStateHelpComponent } from 'src/app/shared/components/state-help/wrapper-components/reservation-request-state-help.component';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { RequestModification } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { datePipeFunc } from 'src/app/utils/date-pipe-func';
import { toTitleCase } from 'src/app/utils/to-title-case';
import { CustomActionButton } from '../buttons/custom-action-button';
import { ReservationRequestStateColumnComponent } from '../column-components/state-chip-column/components/reservation-request-state-column.component';
import { StaticDataSource } from './static-datasource';

export class ModificationHistoryDataSource extends StaticDataSource<
  RequestModification,
  RequestModification
> {
  constructor(
    data: RequestModification[],
    private _datePipe: MomentDatePipe,
    private _openModification: (id: string) => void,
    private _isOpenDisabledFunc: (row: RequestModification) => boolean
  ) {
    super(data);

    this.displayedColumns = [
      {
        name: 'createdAt',
        displayName: $localize`:table column:Created at`,
        pipeFunc: datePipeFunc.bind({ datePipe: this._datePipe }),
      },
      { name: 'createdBy', displayName: $localize`:table column:Created by` },
      {
        name: 'type',
        displayName: $localize`:table column:Type`,
        pipeFunc: (value: unknown) => toTitleCase(value as string),
      },
      {
        name: 'state',
        displayName: $localize`:table column:State`,
        component: ReservationRequestStateColumnComponent,
        helpComponent: ReservationRequestStateHelpComponent,
      },
    ];

    this.buttons = [
      new CustomActionButton(
        $localize`:button name:View modification`,
        'visibility',
        (row: RequestModification) => {
          this._openModification(row.id);
          return of('');
        },
        this._isOpenDisabledFunc
      ),
    ];
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection
  ): Observable<ApiResponse<RequestModification>> {
    return of(
      this.getFakeApiResponse(pageSize, pageIndex, sortedColumn, sortDirection)
    );
  }
}
