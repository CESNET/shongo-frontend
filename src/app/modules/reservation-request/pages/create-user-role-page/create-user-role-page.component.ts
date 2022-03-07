import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { IdentityType } from 'src/app/shared/models/enums/identity-type.enum';
import { RoleType } from 'src/app/shared/models/enums/role-type.enum';

@Component({
  selector: 'app-create-user-role-page',
  templateUrl: './create-user-role-page.component.html',
  styleUrls: ['./create-user-role-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserRolePageComponent implements OnInit {
  form?: FormGroup;

  IdentityType = IdentityType;
  roleTypes = Object.values(RoleType);

  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this._route.params.pipe(first()).subscribe((params) => {
      this.form = this._createForm(params.id);
    });
  }

  private _createForm(requestId: string): FormGroup {
    return new FormGroup({
      reservationRequest: new FormControl(
        { value: requestId, disabled: true },
        [Validators.required]
      ),
      identityType: new FormControl(IdentityType.USER, [Validators.required]),
      identity: new FormControl(null, [Validators.required]),
      role: new FormControl(RoleType.OWNER, [Validators.required]),
    });
  }
}
