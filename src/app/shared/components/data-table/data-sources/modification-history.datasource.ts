import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Observable, of } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { RequestModification } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { datePipeFunc } from 'src/app/utils/datePipeFunc';
import { toTitleCase } from 'src/app/utils/toTitleCase';
import { CustomActionButton } from '../buttons/custom-action-button';
import { TableButton } from '../buttons/table-button';
import { TableColumn } from '../models/table-column.interface';
import { StaticDataSource } from './static-datasource';

export class ModificationHistoryDataSource extends StaticDataSource<
  RequestModification,
  RequestModification
> {
  displayedColumns: TableColumn[];
  buttons: TableButton<RequestModification>[];

  constructor(
    data: RequestModification[],
    private _datePipe: DatePipe,
    private _openModification: (id: string) => void,
    private _isOpenDisabledFunc: (row: RequestModification) => boolean
  ) {
    super(data);

    this.displayedColumns = [
      {
        name: 'createdAt',
        displayName: 'Created at',
        pipeFunc: datePipeFunc.bind({ datePipe: this._datePipe }),
      },
      { name: 'createdBy', displayName: 'Created by' },
      {
        name: 'type',
        displayName: 'Type',
        pipeFunc: (value: unknown) => toTitleCase(value as string),
      },
      { name: 'state', displayName: 'State' },
    ];

    this.buttons = [
      new CustomActionButton(
        'View modification',
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
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<RequestModification>> {
    return of(
      this.getFakeApiResponse(
        pageSize,
        pageIndex,
        sortedColumn,
        sortDirection,
        filter
      )
    );
  }
}
