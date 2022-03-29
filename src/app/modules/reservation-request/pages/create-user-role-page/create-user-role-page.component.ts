import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { ReservationRequestService } from 'src/app/core/http/reservation-request/reservation-request.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
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
  @ViewChild(AlertComponent) alert!: AlertComponent;

  form?: FormGroup;
  IdentityType = IdentityType;
  roleTypes = Object.values(RoleType);
  posting$ = new BehaviorSubject(false);

  AlertType = AlertType;

  getFormError = getFormError;

  constructor(
    private _route: ActivatedRoute,
    private _resReqService: ReservationRequestService,
    private _router: Router
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
        })
      )
      .subscribe({
        next: () => {
          this.posting$.next(false);
          this._router.navigate(['../../'], { relativeTo: this._route });
        },
        error: () => {
          this.posting$.next(false);
          this.alert.isActive = true;
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
