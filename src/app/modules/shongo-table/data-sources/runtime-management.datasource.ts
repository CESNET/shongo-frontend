import { HttpParams } from '@angular/common/http';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
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
import { isNullOrUndefined } from 'src/app/utils/null-or-undefined';
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
  video: string;
  microphoneLevel: string;
  microphoneEnabled: StringBool;
  videoSnapshot: StringBool;
  videoEnabled: StringBool;
  displayNameEnabled: StringBool;
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
        (participant) => participant.videoSnapshot === 'false',
        (participant) => participant.videoSnapshot !== 'undefined'
      ),
      new SetMicrophoneLevelButton(
        this._resReqService,
        this._dialog,
        this.requestId,
        undefined,
        (participant) => participant.microphoneLevel !== 'undefined'
      ),
      new SetDisplayNameButton(
        this._resReqService,
        this._dialog,
        this.requestId,
        undefined,
        (participant) => participant.displayNameEnabled !== 'undefined'
      ),
      new SetMicrophoneEnabledButton(
        this._resReqService,
        this.requestId,
        false,
        undefined,
        (participant) =>
          participant.microphoneEnabled !== 'undefined' &&
          participant.microphoneEnabled === 'true'
      ),
      new SetMicrophoneEnabledButton(
        this._resReqService,
        this.requestId,
        true,
        undefined,
        (participant) =>
          participant.microphoneEnabled !== 'undefined' &&
          participant.microphoneEnabled === 'false'
      ),
      new SetVideoEnabledButton(
        this._resReqService,
        this.requestId,
        false,
        undefined,
        (participant) =>
          participant.videoEnabled !== 'undefined' &&
          participant.videoEnabled === 'true'
      ),
      new SetVideoEnabledButton(
        this._resReqService,
        this.requestId,
        true,
        undefined,
        (participant) =>
          participant.videoEnabled !== 'undefined' &&
          participant.videoEnabled === 'false'
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
            displayNameEnabled: this._getDisplayNameEnabled(item),
          }));

          return { count, items: mappedItems };
        })
      );
  }

  private _getId(item: RuntimeParticipant): string {
    return item.id ? String(item.id) : $localize`None`;
  }

  private _getDisplayName(item: RuntimeParticipant): string {
    return item.alias ?? item.name ?? $localize`Unknown user`;
  }

  private _getParticipant(item: RuntimeParticipant): string {
    return (
      (item.name ?? item.alias ?? $localize`Unknown user`) +
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

  private _getVideo(item: RuntimeParticipant): string {
    return !!item.videoEnabled ? $localize`Yes` : $localize`No`;
  }

  private _getMicrophoneLevel(item: RuntimeParticipant): string {
    if (!isNullOrUndefined(item.microphoneLevel)) {
      return String(item.microphoneLevel);
    }
    return 'undefined';
  }

  private _getVideoSnapshot(item: RuntimeParticipant): StringBool {
    if (!isNullOrUndefined(item.videoSnapshot)) {
      return String(item.videoSnapshot) as StringBool;
    }
    return 'undefined';
  }

  private _getMicrophoneEnabled(item: RuntimeParticipant): StringBool {
    if (!isNullOrUndefined(item.microphoneEnabled)) {
      return String(item.microphoneEnabled) as StringBool;
    }
    return 'undefined';
  }

  private _getVideoEnabled(item: RuntimeParticipant): StringBool {
    if (!isNullOrUndefined(item.videoEnabled)) {
      return String(item.videoEnabled) as StringBool;
    }
    return 'undefined';
  }

  private _getDisplayNameEnabled(item: RuntimeParticipant): StringBool {
    if (isNullOrUndefined(item.alias)) {
      return 'undefined';
    }
    return 'true';
  }
}
