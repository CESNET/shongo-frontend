import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { finalize, first, switchMap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { AlertType } from 'src/app/shared/models/enums/alert-type.enum';
import { IdentityType } from 'src/app/shared/models/enums/identity-type.enum';
import { RoleType } from 'src/app/shared/models/enums/role-type.enum';
import { Option } from 'src/app/shared/models/interfaces/option.interface';
import { RoleBody } from 'src/app/shared/models/rest-api/request-participant.interface';
import { getFormError } from 'src/app/utils/get-form-error';

@Component({
  selector: 'app-create-user-role-page',
  templateUrl: './create-user-role-page.component.html',
  styleUrls: ['../../styles/create-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserRolePageComponent implements OnInit {
  form?: UntypedFormGroup;
  IdentityType = IdentityType;
  posting$ = new BehaviorSubject(false);

  roleTypes: Option<RoleType>[] = [
    { value: RoleType.OWNER, displayName: $localize`:role type:Owner` },
    { value: RoleType.USER, displayName: $localize`:role type:User` },
    { value: RoleType.READER, displayName: $localize`:role type:Reader` },
  ];

  AlertType = AlertType;

  getFormError = getFormError;

  constructor(
    private _route: ActivatedRoute,
    private _resReqService: ReservationRequestService,
    private _router: Router,
    private _alert: AlertService
  ) {}

  ngOnInit(): void {
    this._route.params.pipe(first()).subscribe((params) => {
      this.form = this._createForm(params.id);
    });
  }

  /**
   * Returns form validity.
   *
   * @returns True if form is valid, else false.
   */
  isValid(): boolean {
    return this.form ? this.form?.valid : false;
  }

  /**
   * Posts created user role.
   */
  postUserRole(): void {
    this.posting$.next(true);

    this._route.params
      .pipe(
        first(),
        switchMap((params) => {
          const roleBody = this._createRoleBody();
          return this._resReqService.postRole(roleBody, params.id);
        }),

        finalize(() => this.posting$.next(false))
      )
      .subscribe({
        next: () => {
          this._alert.showSuccess($localize`:success message:Role created`);
          this._router.navigate(['../../'], { relativeTo: this._route });
        },
        error: () => {
          this._alert.showError(
            $localize`:error message:Failed to create role`
          );
        },
      });
  }

  /**
   * Creates role body.
   *
   * @returns Role body.
   */
  private _createRoleBody(): RoleBody {
    const { identityType, identityId, role } = this.form?.value;

    return {
      type: identityType,
      entityId: identityId,
      role,
    };
  }

  /**
   * Creates user role form.
   *
   * @param requestId Reservation request ID.
   * @returns Form group.
   */
  private _createForm(requestId: string): UntypedFormGroup {
    return new UntypedFormGroup({
      reservationRequest: new UntypedFormControl(
        { value: requestId, disabled: true },
        [Validators.required]
      ),
      identityType: new UntypedFormControl(IdentityType.USER, [
        Validators.required,
      ]),
      identityId: new UntypedFormControl(null, [Validators.required]),
      role: new UntypedFormControl(RoleType.OWNER, [Validators.required]),
    });
  }
}
