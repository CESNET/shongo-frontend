import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { Observable, of } from 'rxjs';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Recording } from 'src/app/shared/models/rest-api/recording';
import { DeleteButton } from '../buttons/delete-button';
import { DataTableDataSource } from './data-table-datasource';
import { datePipeFunc } from 'src/app/utils/datePipeFunc';
import { RecordingViewUrlColumnComponent } from 'src/app/modules/reservation-request/components/recording-view-url-column/recording-view-url-column.component';
import { CustomActionButton } from '../buttons/custom-action-button';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';

export class RoomRecordingsDataSource extends DataTableDataSource<Recording> {
  constructor(
    private _resReqService: ReservationRequestService,
    private _dialog: MatDialog,
    private _datePipe: MomentDatePipe,
    public requestId: string
  ) {
    super();

    this.displayedColumns = [
      {
        name: 'beginDate',
        displayName: 'Recorded at',
        pipeFunc: datePipeFunc.bind({ datePipe: this._datePipe }),
      },
      {
        name: 'duration',
        displayName: 'Duration',
        pipeFunc: this.formatDuration,
      },
      {
        name: 'url',
        displayName: 'URL',
        component: RecordingViewUrlColumnComponent,
      },
    ];

    this.buttons = [
      new CustomActionButton('Download', 'download', this.downloadRecording),
      new DeleteButton(
        this._resReqService,
        this._dialog,
        `/${requestId}/recordings/:id`
      ),
    ];
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<Recording>> {
    return this._resReqService.fetchRecordings(
      pageSize,
      pageIndex,
      sortedColumn,
      sortDirection,
      filter,
      this.requestId
    );
  }

  downloadRecording = (row: Recording): Observable<string> => {
    window.location.assign(row.downloadUrl);
    return of('');
  };

  formatDuration = (value: unknown): string => {
    try {
      let milliseconds = Number(value);

      const hours = Math.floor(milliseconds / 3600000);

      if (hours > 23) {
        return '> day';
      }

      milliseconds = milliseconds % 3600000;
      const minutes = Math.floor(milliseconds / 60000);
      milliseconds = milliseconds % 60000;
      const seconds = Math.floor(milliseconds / 1000);

      return `${this._toTwoIntegerPlaces(
        String(hours)
      )}:${this._toTwoIntegerPlaces(
        String(minutes)
      )}:${this._toTwoIntegerPlaces(String(seconds))}`;
    } catch {
      throw new Error('Value must be a number.');
    }
  };

  _toTwoIntegerPlaces(value: string): string {
    return ('0' + value).slice(value.length - 1);
  }
}
