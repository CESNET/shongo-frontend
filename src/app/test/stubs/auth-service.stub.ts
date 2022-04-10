import { BehaviorSubject, Observable } from 'rxjs';
import {
  mockAccessToken,
  mockIdentityClaims,
  mockIdToken,
  mockRefreshToken,
} from 'src/app/test/mocks/auth-data.mock';

export class AuthServiceStub {
  isAuthenticated$: Observable<boolean>;

  idToken = mockIdToken;
  refreshToken = mockRefreshToken;
  accessToken = mockAccessToken;
  identityClaims = mockIdentityClaims;

  private _isAuthenticated$ = new BehaviorSubject(true);

  constructor() {
    this.isAuthenticated$ = this._isAuthenticated$.asObservable();
  }

  setIsAuthenticated(value: boolean): void {
    this._isAuthenticated$.next(value);
  }

  login(): void {}

  initializeOauthService(): void {}
}
