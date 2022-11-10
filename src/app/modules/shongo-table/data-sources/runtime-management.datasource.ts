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
import { RuntimeParticipant } from 'src/app/shared/models/rest-api/runtime-participant.interface';
import { StringBool } from 'src/app/shared/models/types/string-bool.type';
import { toTitleCase } from 'src/app/utils/to-title-case';
import { CustomActionButton } from '../buttons/custom-action-button';
import { DataTableDataSource } from './data-table-datasource';

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
            id: this._getId(item),
            displayName: this._getDisplayName(item),
            participant: this._getParticipant(item),
            role: this._getRole(item),
            layout: this._getLayout(item),
            microphone: this._getMicrophone(item),
            microphoneLevel: this._getMicrophoneLevel(item),
            video: this._getVideo(item),
            videoSnapshot: this._getVideoSnapshot(item),
            microphoneEnabled: this._getMicrophoneEnabled(item),
            videoEnabled: this._getVideoEnabled(item),
          }));

          return { count, items: mappedItems };
        })
      );
  }

  private _getId(item: RuntimeParticipant): string {
    return item.id ? String(item.id) : $localize`None`;
  }

  private _getDisplayName(item: RuntimeParticipant): string {
    return item.displayName ?? item.name ?? $localize`Unknown user`;
  }

  private _getParticipant(item: RuntimeParticipant): string {
    return (
      (item.name ?? item.displayName ?? $localize`Unknown user`) +
      (item.email ? ` (${item.email})` : '')
    );
  }

  private _getRole(item: RuntimeParticipant): string {
    return item.role ? toTitleCase(item.role) : $localize`None`;
  }

  private _getLayout(item: RuntimeParticipant): string {
    return item.layout ? toTitleCase(item.layout) : $localize`None`;
  }

  private _getMicrophone(item: RuntimeParticipant): string {
    return (
      `${!!item.microphoneEnabled ? $localize`Yes` : $localize`No`}` +
      (item.microphoneEnabled && item.microphoneLevel
        ? ` (${item.microphoneLevel}%)`
        : '')
    );
  }

  private _getMicrophoneLevel(item: RuntimeParticipant): string {
    return item.microphoneLevel ? String(item.microphoneLevel) : 'Unknown';
  }

  private _getVideo(item: RuntimeParticipant): string {
    return !!item.videoEnabled ? $localize`Yes` : $localize`No`;
  }

  private _getVideoSnapshot(item: RuntimeParticipant): StringBool {
    return String(!!item.videoSnapshot) as StringBool;
  }

  private _getMicrophoneEnabled(item: RuntimeParticipant): StringBool {
    return String(!!item.microphoneEnabled) as StringBool;
  }

  private _getVideoEnabled(item: RuntimeParticipant): StringBool {
    return String(!!item.videoEnabled) as StringBool;
  }
}
