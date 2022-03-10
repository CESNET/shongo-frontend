import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ReservationRequest } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { datePipeFunc } from 'src/app/utils/datePipeFunc';
import { DeleteButton } from '../buttons/delete-button';
import { LinkButton } from '../buttons/link-button';
import { ReservationRequestStateColumnComponent } from '../column-components/state-chip-column/components/reservation-request-state-column.component';
import { DataTableDataSource } from './data-table-datasource';

interface CapacityRequestsTableData {
  id: string;
  slotStart: string;
  slotEnd: string;
  participantCount: number;
  parentRequestId?: string;
  state: string;
}

export class CapacityRequestsDataSource extends DataTableDataSource<CapacityRequestsTableData> {
  constructor(
    public parentRequestId: string,
    private _resReqService: ReservationRequestService,
    private _datePipe: DatePipe,
    private _dialog: MatDialog
  ) {
    super();

    this.displayedColumns = [
      {
        name: 'slotStart',
        displayName: 'Slot start',
        pipeFunc: datePipeFunc.bind({ datePipe: this._datePipe }),
      },
      {
        name: 'slotEnd',
        displayName: 'Slot end',
        pipeFunc: datePipeFunc.bind({ datePipe: this._datePipe }),
      },
      { name: 'participantCount', displayName: 'Participant count' },
      {
        name: 'state',
        displayName: 'State',
        component: ReservationRequestStateColumnComponent,
      },
    ];

    this.buttons = [
      new LinkButton(
        'View reservation request',
        'visibility',
        '/reservation-request/:id'
      ),
      new DeleteButton(this._resReqService, this._dialog, '/:id'),
    ];
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<CapacityRequestsTableData>> {
    filter = filter.set('parentRequestId', this.parentRequestId);

    return this._resReqService
      .fetchTableItems<ReservationRequest>(
        pageSize,
        pageIndex,
        sortedColumn,
        sortDirection,
        filter
      )
      .pipe(
        map((tableData) => {
          const { count, items } = tableData;
          const mappedItems = items.map((item) => ({
            id: item.id,
            slotStart: item.slot.start,
            slotEnd: item.slot.end,
            state: item.state,
            participantCount: item.roomCapacityData!.capacityParticipantCount,
            parentRequestId: item.parentRequestId,
          }));

          return { count, items: mappedItems };
        })
      );
  }
}
