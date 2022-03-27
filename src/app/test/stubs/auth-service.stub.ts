import { of } from 'rxjs';
import {
  mockAccessToken,
  mockIdentityClaims,
  mockIdToken,
  mockRefreshToken,
} from 'src/app/test/mocks/auth-data.mock';

export const authServiceStub = {
  isAuthenticatedSubject$: of(true),
  idToken: mockIdToken,
  refreshToken: mockRefreshToken,
  accessToken: mockAccessToken,
  identityClaims: mockIdentityClaims,
};
