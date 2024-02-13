import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';

/**
 * Checks if user is authenticated.
 */
@Injectable({
  providedIn: 'root',
})
export class IsAuthGuard {
  constructor(private _auth: AuthenticationService, private _router: Router) {}

  canLoad(): Observable<boolean> {
    return this._auth.canActivateProtectedRoutes$.pipe(
      tap((canActivate: boolean) => {
        if (!canActivate) {
          this._router.navigate(['unauthorized']);
        }
      }),
      catchError(() => {
        this._router.navigate(['unauthorized']);
        return of(false);
      }),
      first()
    );
  }
}
