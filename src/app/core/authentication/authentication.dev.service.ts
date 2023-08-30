import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { IAuthenticationService } from './authentication-service.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationDevService implements IAuthenticationService {
  isAuthenticated$ = of(true);
  isDoneLoading$ = of(true);
  canActivateProtectedRoutes$ = of(true);

  idToken = '';
  accessToken = '';
  refreshToken = '';
  identityClaims = {
    email: 'test@shongo.cz',
    name: 'Test User',
  };

  displayLoginDialog(): void {}

  login(): void {}

  logout(): void {}

  initializeOauthService(): Promise<void> {
    return Promise.resolve();
  }

  hasValidAccessToken(): boolean {
    return true;
  }
}
