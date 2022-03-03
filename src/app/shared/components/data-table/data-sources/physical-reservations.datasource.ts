import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ReservationType } from 'src/app/models/enums/reservation-type.enum';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ReservationRequest } from 'src/app/shared/models/rest-api/reservation-request.interface';
import { Room } from 'src/app/shared/models/rest-api/room.interface';
import { DeleteButton } from '../buttons/delete-button';
import { LinkButton } from '../buttons/link-button';
import { TableButton } from '../buttons/table-button';
import { TableColumn } from '../models/table-column.interface';
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
  displayedColumns: TableColumn[];
  buttons: TableButton[];

  constructor(
    private _resReqService: ReservationRequestService,
    private _datePipe: DatePipe,
    private _dialog: MatDialog
  ) {
    super();

    this.displayedColumns = [
      { name: 'resourceName', displayName: 'Meeting room' },
      {
        name: 'slotStart',
        displayName: 'Slot start',
        pipeFunc: this.datePipe,
      },
      { name: 'slotEnd', displayName: 'Slot end', pipeFunc: this.datePipe },
      { name: 'state', displayName: 'Reservation state' },
      { name: 'resourceDescription', displayName: 'Description' },
    ];

    this.buttons = [
      new LinkButton('Edit meeting room', 'settings', '/meeting_room/:id'),
      new DeleteButton(this._resReqService, this._dialog),
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
            resourceName: item?.physicalResourceData?.resourceName ?? 'unknown',
            slotStart: item.slot.start,
            slotEnd: item.slot.end,
            state: item.state,
            resourceDescription:
              item?.physicalResourceData?.resourceDescription ?? 'unknown',
          }));

          return { count, items: mappedItems };
        })
      );
  }

  datePipe = (value: unknown): string => {
    if (typeof value === 'string') {
      return this._datePipe.transform(value, 'medium') ?? 'Not a date';
    } else {
      throw new Error('Invalid column data type for date pipe.');
    }
  };
}
