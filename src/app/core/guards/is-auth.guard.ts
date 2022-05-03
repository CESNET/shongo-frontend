import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class IsAuthGuard implements CanLoad {
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
