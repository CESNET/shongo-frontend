import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RuntimeParticipantTableData } from 'src/app/modules/shongo-table/data-sources/runtime-management.datasource';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-snapshot-dialog',
  templateUrl: './user-snapshot-dialog.component.html',
  styleUrls: ['./user-snapshot-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSnapshotDialogComponent implements OnInit {
  snapshotUrl?: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { participant: RuntimeParticipantTableData; requestId: string }
  ) {}

  ngOnInit(): void {
    this.snapshotUrl = `http${environment.useHttps ? 's' : ''}://${
      environment.shongoRESTApiHost
    }:${environment.shongoRESTApiPort}/api/v1/${Endpoint.RES_REQUEST}/${
      this.data.requestId
    }/runtime_management/participants/${this.data.participant.id}/snapshot`;
  }
}
