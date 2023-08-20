import { IdentityClaims } from '@app/shared/models/interfaces/identity-claims.interface';
import { Observable } from 'rxjs';

export interface IAuthenticationService {
  isAuthenticated$: Observable<boolean>;
  isDoneLoading$: Observable<boolean>;
  canActivateProtectedRoutes$: Observable<boolean>;
  idToken: string;
  accessToken: string;
  refreshToken: string;
  identityClaims: Partial<IdentityClaims> | null;

  displayLoginDialog(): void;
  login(): void;
  logout(): void;
  initializeOauthService(): Promise<void>;
  hasValidAccessToken(): boolean;
}
