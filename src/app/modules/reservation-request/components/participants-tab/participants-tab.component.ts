import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { ParticipantsDataSource } from 'src/app/shared/components/data-table/data-sources/participants.datasource';

@Component({
  selector: 'app-participants-tab',
  templateUrl: './participants-tab.component.html',
  styleUrls: ['./participants-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsTabComponent implements OnInit {
  participantsDataSource?: ParticipantsDataSource;

  constructor(
    private _resReqService: ReservationRequestService,
    private _dialog: MatDialog,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._route.params.pipe(first()).subscribe((params) => {
      this.participantsDataSource = new ParticipantsDataSource(
        this._resReqService,
        this._dialog,
        params.id
      );
    });
  }
}
