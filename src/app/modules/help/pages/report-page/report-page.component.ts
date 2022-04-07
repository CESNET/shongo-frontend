import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { finalize, first, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { ReportService } from 'src/app/core/http/report/report.service';
import { AlertService } from 'src/app/core/services/alert.service';
import {
  emailErrorHandler,
  minLengthErrorHandler,
} from 'src/app/utils/error-handlers';
import { getFormError } from 'src/app/utils/getFormError';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPageComponent implements OnDestroy {
  readonly form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    message: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  readonly getFormError = getFormError;
  readonly minLengthErrorHandler = minLengthErrorHandler;
  readonly emailErrorHandler = emailErrorHandler;

  readonly loading$ = new BehaviorSubject(false);
  private readonly _destroy$ = new Subject<void>();

  showMetadata = false;

  constructor(
    public reportService: ReportService,
    private _alert: AlertService,
    private _auth: AuthenticationService
  ) {
    this._auth.isAuthenticated$
      .pipe(takeUntil(this._destroy$))
      .subscribe((isAuth) => this._handleIsAuthenticated(isAuth));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  toggleMetadata(): void {
    this.showMetadata = !this.showMetadata;
  }

  report(): void {
    this.loading$.next(true);

    this.reportService
      .report(this.form.value)
      .pipe(
        first(),
        finalize(() => this.loading$.next(false))
      )
      .subscribe({
        next: () => {
          this._alert.showSuccess(
            $localize`:alert message|Alert message on successful report submission:Report has been sent`
          );
        },
        error: (err) => {
          console.error(err);
          this._alert.showError(
            $localize`:alert message|Alert message on fauled report submission:Failed to send report.`
          );
        },
      });
  }

  private _handleIsAuthenticated(isAuthenticated: boolean): void {
    const email = this.form.get('email')!;

    if (isAuthenticated) {
      email.setValue(this._auth.identityClaims?.email);
      email.disable();
    } else {
      email.reset();
      email.enable();
    }
  }
}
