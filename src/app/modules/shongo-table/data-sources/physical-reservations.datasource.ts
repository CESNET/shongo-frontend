import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ReservationRequestStateHelpComponent } from 'src/app/shared/components/state-help/wrapper-components/reservation-request-state-help.component';
import { ReservationType } from 'src/app/shared/models/enums/reservation-type.enum';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ReservationRequest } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { datePipeFunc } from 'src/app/utils/date-pipe-func';
import { DeleteButton } from '../buttons/delete-button';
import { LinkButton } from '../buttons/link-button';
import { ReservationRequestStateColumnComponent } from '../column-components/state-chip-column/components/reservation-request-state-column.component';
import { DataTableDataSource } from './data-table-datasource';

interface PhysicalReservationsTableData {
  id: string;
  resourceName: string;
  slotStart: string;
  slotEnd: string;
  state: string;
  resourceDescription: string;
}

export class PhysicalReservationsDataSource extends DataTableDataSource<PhysicalReservationsTableData> {
  constructor(
    public apiService: ReservationRequestService,
    private _datePipe: MomentDatePipe,
    private _dialog: MatDialog
  ) {
    super();

    this.displayedColumns = [
      {
        name: 'resourceName',
        displayName: $localize`:table column:Meeting room`,
        sortBy: 'RESOURCE_ROOM_NAME',
      },
      {
        name: 'slotStart',
        displayName: $localize`:table column:Slot start`,
        pipeFunc: datePipeFunc.bind({ datePipe: this._datePipe }),
        sortBy: 'SLOT_START',
      },
      {
        name: 'slotEnd',
        displayName: $localize`:table column:Slot end`,
        pipeFunc: datePipeFunc.bind({ datePipe: this._datePipe }),
        sortBy: 'SLOT_END',
      },
      {
        name: 'state',
        displayName: $localize`:table column:Reservation state`,
        component: ReservationRequestStateColumnComponent,
        helpComponent: ReservationRequestStateHelpComponent,
        sortBy: 'STATE',
      },
      {
        name: 'resourceDescription',
        displayName: $localize`:table column:Description`,
      },
    ];

    this.buttons = [
      new LinkButton(
        $localize`:button name:View reservation request`,
        'visibility',
        '/reservation-request/:id'
      ),
      new LinkButton(
        $localize`:button name:Edit meeting room`,
        'settings',
        '/reservation-request/:id/edit'
      ),
      new DeleteButton(this.apiService, this._dialog, '/:id'),
    ];
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<PhysicalReservationsTableData>> {
    filter = filter.set('type', ReservationType.PHYSICAL_RESOURCE);
    return this.apiService
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
            resourceName:
              item?.physicalResourceData?.resourceName ??
              $localize`:fallback text:Unknown`,
            slotStart: item.slot.start,
            slotEnd: item.slot.end,
            state: item.state,
            resourceDescription:
              item?.description ?? $localize`:fallback text:Unknown`,
          }));

          return { count, items: mappedItems };
        })
      );
  }
}
