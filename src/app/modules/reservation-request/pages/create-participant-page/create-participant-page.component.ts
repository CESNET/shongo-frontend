import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { finalize, first, switchMap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { AlertType } from 'src/app/shared/models/enums/alert-type.enum';
import { ParticipantRole } from 'src/app/shared/models/enums/participant-role.enum';
import { ParticipantType } from 'src/app/shared/models/enums/participant-type.enum';
import {
  GuestParticipantPostBody,
  UserParticipantPostBody,
} from 'src/app/shared/models/rest-api/request-participant.interface';
import { User } from 'src/app/shared/models/rest-api/user.interface';
import { getFormError } from 'src/app/utils/getFormError';

@Component({
  selector: 'app-create-participant-page',
  templateUrl: './create-participant-page.component.html',
  styleUrls: ['../../styles/create-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateParticipantPageComponent {
  form = new FormGroup({
    participantType: new FormControl(ParticipantType.USER, [
      Validators.required,
    ]),
    userForm: new FormGroup({
      userFilter: new FormControl(null),
      userId: new FormControl(null, [Validators.required]),
      role: new FormControl(ParticipantRole.PARTICIPANT, [Validators.required]),
    }),
    anonymousForm: new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
    }),
  });

  filteredUsers: User[] = [];
  ParticipantType = ParticipantType;
  participantRoles = Object.values(ParticipantRole);
  searchingUsers$ = new BehaviorSubject<boolean>(false);
  posting$ = new BehaviorSubject<boolean>(false);

  AlertType = AlertType;

  getFormError = getFormError;

  constructor(
    private _resReqService: ReservationRequestService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _alert: AlertService
  ) {}

  isValid(): boolean {
    const { participantType, userForm, anonymousForm } = this.form.controls;

    return (
      participantType.valid &&
      (participantType.value === ParticipantType.USER
        ? userForm.valid
        : anonymousForm.valid)
    );
  }

  postParticipant(): void {
    const participantType = this.form.get('participantType')!.value;
    this.posting$.next(true);

    this._route.params
      .pipe(
        first(),
        switchMap((params) => {
          if (participantType === ParticipantType.USER) {
            const userBody = this._createUserBody();
            return this._resReqService.postParticipant(userBody, params.id);
          } else {
            const guestBody = this._createGuestBody();
            return this._resReqService.postParticipant(guestBody, params.id);
          }
        }),
        finalize(() => this.posting$.next(false))
      )
      .subscribe({
        next: () => {
          this._alert.showSuccess(
            $localize`:success message:Participant created`
          );
          this._router.navigate(['../../'], { relativeTo: this._route });
        },
        error: () => {
          this._alert.showError(
            $localize`:error message:Failed to create participant`
          );
        },
      });
  }

  private _createUserBody(): UserParticipantPostBody {
    const { userForm } = this.form.controls;
    const { userId, role } = userForm.value;

    return {
      userId,
      role,
    };
  }

  private _createGuestBody(): GuestParticipantPostBody {
    const { anonymousForm } = this.form.controls;
    const { name, email } = anonymousForm.value;

    return {
      name,
      email,
      role: ParticipantRole.PARTICIPANT,
    };
  }
}
