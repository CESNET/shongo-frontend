import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from '@angular/material/sort';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { DisconnectUserButton } from 'src/app/modules/reservation-request/classes/buttons/disconnect-user.button';
import { SetDisplayNameButton } from 'src/app/modules/reservation-request/classes/buttons/set-display-name.button';
import { SetMicrophoneEnabledButton } from 'src/app/modules/reservation-request/classes/buttons/set-microphone-enabled.button';
import { SetMicrophoneLevelButton } from 'src/app/modules/reservation-request/classes/buttons/set-microphone-level.button';
import { SetVideoEnabledButton } from 'src/app/modules/reservation-request/classes/buttons/set-video-enabled.button';
import { UserSnapshotDialogComponent } from 'src/app/modules/reservation-request/components/user-snapshot-dialog/user-snapshot-dialog.component';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { toTitleCase } from 'src/app/utils/toTitleCase';
import { CustomActionButton } from '../buttons/custom-action-button';
import { DataTableDataSource } from './data-table-datasource';

// MatTable automatically converts all data to type string, consequently we have to compare boolean types as strings.
type StringBool = 'true' | 'false';

export interface RuntimeParticipantTableData {
  id: string;
  participant: string;
  role: string;
  displayName: string;
  layout: string;
  microphone: string;
  microphoneLevel: string;
  microphoneEnabled: StringBool;
  video: string;
  videoSnapshot: StringBool;
  videoEnabled: StringBool;
}

export class RuntimeManagementDataSource extends DataTableDataSource<RuntimeParticipantTableData> {
  constructor(
    private _resReqService: ReservationRequestService,
    private _dialog: MatDialog,
    public requestId: string
  ) {
    super();

    this.displayedColumns = [
      { name: 'participant', displayName: $localize`:table column:User` },
      { name: 'role', displayName: $localize`:table column:Role` },
      { name: 'layout', displayName: $localize`:table column:Layout` },
      { name: 'microphone', displayName: $localize`:table column:Microphone` },
      { name: 'video', displayName: $localize`:table column:Video` },
    ];

    this.buttons = [
      new CustomActionButton(
        $localize`:button name:Take video snapshot`,
        'photo_camera',
        (participant) => this.openUserSnapshot(participant),
        (participant) => participant.videoSnapshot === 'true'
      ),
      new SetMicrophoneLevelButton(
        this._resReqService,
        this._dialog,
        this.requestId
      ),
      new SetDisplayNameButton(
        this._resReqService,
        this._dialog,
        this.requestId
      ),
      new SetMicrophoneEnabledButton(
        this._resReqService,
        this.requestId,
        false,
        undefined,
        (participant) => participant.microphoneEnabled === 'true'
      ),
      new SetMicrophoneEnabledButton(
        this._resReqService,
        this.requestId,
        true,
        undefined,
        (participant) => participant.microphoneEnabled === 'false'
      ),
      new SetVideoEnabledButton(
        this._resReqService,
        this.requestId,
        false,
        undefined,
        (participant) => participant.videoEnabled === 'true'
      ),
      new SetVideoEnabledButton(
        this._resReqService,
        this.requestId,
        true,
        undefined,
        (participant) => participant.videoEnabled === 'false'
      ),
      new DisconnectUserButton(this._resReqService, this.requestId),
    ];
  }

  openUserSnapshot(
    participant: RuntimeParticipantTableData
  ): Observable<string> {
    this._dialog.open(UserSnapshotDialogComponent, {
      width: '90%',
      maxWidth: '900px',
      data: { participant, requestId: this.requestId },
    });
    return of('');
  }

  getData(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
  ): Observable<ApiResponse<RuntimeParticipantTableData>> {
    return this._resReqService
      .fetchRuntimeParticipants(
        pageSize,
        pageIndex,
        sortedColumn,
        sortDirection,
        filter,
        this.requestId
      )
      .pipe(
        map((tableData) => {
          const { count, items } = tableData;

          const mappedItems = items.map((item) => ({
            id: String(item.id),
            displayName: item.displayName,
            participant:
              (item.name ?? item.displayName) +
              (item.email ? ` (${item.email})` : ''),
            role: toTitleCase(item.role),
            layout: toTitleCase(item.layout),
            microphone:
              `${item.microphoneEnabled ? $localize`Yes` : $localize`No`}` +
              (item.microphoneEnabled && item.microphoneLevel
                ? ` (${item.microphoneLevel}%)`
                : ''),
            microphoneLevel: String(item.microphoneLevel),
            video: item.videoEnabled ? $localize`Yes` : $localize`No`,
            videoSnapshot: String(item.videoSnapshot) as StringBool,
            microphoneEnabled: String(item.microphoneEnabled) as StringBool,
            videoEnabled: String(item.videoEnabled) as StringBool,
          }));

          return { count, items: mappedItems };
        })
      );
  }
}
