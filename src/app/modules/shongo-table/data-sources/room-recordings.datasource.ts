import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { Observable, of } from 'rxjs';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { RecordingViewUrlColumnComponent } from 'src/app/modules/reservation-request/components/recording-view-url-column/recording-view-url-column.component';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { Recording } from 'src/app/shared/models/rest-api/recording';
import { MomentDatePipe } from 'src/app/shared/pipes/moment-date.pipe';
import { datePipeFunc } from 'src/app/utils/date-pipe-func';
import { CustomActionButton } from '../buttons/custom-action-button';
import { DeleteButton } from '../buttons/delete-button';
import { DataTableDataSource } from './data-table-datasource';

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
        displayName: $localize`:table column:Recorded at`,
        pipeFunc: datePipeFunc.bind({ datePipe: this._datePipe }),
      },
      {
        name: 'duration',
        displayName: $localize`:table column:Duration`,
        pipeFunc: this.formatDuration,
      },
      {
        name: 'url',
        displayName: $localize`:table column:URL`,
        component: RecordingViewUrlColumnComponent,
      },
    ];

    this.buttons = [
      new CustomActionButton(
        $localize`:button name:Download`,
        'download',
        this.downloadRecording,
        this.isDownloadDisabled
      ),
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

  downloadRecording = ({
    downloadUrl,
    filename,
  }: Recording): Observable<string> => {
    this._downloadURI(downloadUrl, filename);
    return of('');
  };

  isDownloadDisabled = (row: Recording): boolean => {
    return !row.downloadUrl;
  };

  /**
   * Formats recording duration to human readable form.
   *
   * @param value Recording duration in milliseconds.
   * @returns Formatted duration.
   */
  formatDuration = (value: unknown): string => {
    try {
      let milliseconds = Number(value);

      const hours = Math.floor(milliseconds / 3600000);

      if (hours > 23) {
        return $localize`:more than a day:> day`;
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

  /**
   * Formats a number to 2 integer places.
   *
   * @param value Number to format.
   * @returns Formatted number.
   */
  private _toTwoIntegerPlaces(value: string): string {
    return ('0' + value).slice(value.length - 1);
  }

  private _downloadURI(uri: string, name: string): void {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
