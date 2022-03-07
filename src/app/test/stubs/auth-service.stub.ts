import { of } from 'rxjs';
import {
  mockAccessToken,
  mockIdentityClaims,
  mockIdToken,
  mockRefreshToken,
} from 'src/app/core/authentication/mock-auth-data';

export const authServiceStub = {
  isAuthenticatedSubject$: of(true),
  idToken: mockIdToken,
  refreshToken: mockRefreshToken,
  accessToken: mockAccessToken,
  identityClaims: mockIdentityClaims,
};
