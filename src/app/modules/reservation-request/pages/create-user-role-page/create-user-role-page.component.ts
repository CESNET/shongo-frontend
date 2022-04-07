import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { finalize, first, switchMap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { AlertType } from 'src/app/shared/models/enums/alert-type.enum';
import { IdentityType } from 'src/app/shared/models/enums/identity-type.enum';
import { RoleType } from 'src/app/shared/models/enums/role-type.enum';
import { getFormError } from 'src/app/utils/getFormError';

@Component({
  selector: 'app-create-user-role-page',
  templateUrl: './create-user-role-page.component.html',
  styleUrls: ['../../styles/create-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserRolePageComponent implements OnInit {
  form?: FormGroup;
  IdentityType = IdentityType;
  roleTypes = Object.values(RoleType);
  posting$ = new BehaviorSubject(false);

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

  isValid(): boolean {
    return this.form ? this.form?.valid : false;
  }

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

  private _createRoleBody(): any {
    const { identityType, identityId, role } = this.form?.value;

    return {
      type: identityType,
      entityId: identityId,
      role,
    };
  }

  private _createForm(requestId: string): FormGroup {
    return new FormGroup({
      reservationRequest: new FormControl(
        { value: requestId, disabled: true },
        [Validators.required]
      ),
      identityType: new FormControl(IdentityType.USER, [Validators.required]),
      identityId: new FormControl(null, [Validators.required]),
      role: new FormControl(RoleType.OWNER, [Validators.required]),
    });
  }
}
