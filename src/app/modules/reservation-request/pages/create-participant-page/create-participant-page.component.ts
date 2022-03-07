import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
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
  @ViewChild(AlertComponent) alert!: AlertComponent;

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

  getFormError = getFormError;

  constructor(
    private _resReqService: ReservationRequestService,
    private _route: ActivatedRoute,
    private _router: Router
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
            return this._resReqService.postUserParticipant(userBody, params.id);
          } else {
            const guestBody = this._createGuestBody();
            return this._resReqService.postGuestParticipant(
              guestBody,
              params.id
            );
          }
        })
      )
      .subscribe({
        next: () => {
          this.posting$.next(false);
          this._router.navigate(['../../'], { relativeTo: this._route });
        },
        error: () => {
          this.posting$.next(false);
          this.alert.activate();
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
