import { AuthenticationService } from './authentication.service';

/**
 * Used in app initializer to initialize authentication before app bootstrap.
 *
 * @param authService Authentication service.
 * @returns Promise which resolves after auth initialization.
 */
export function authAppInitializerFactory(
  authService: AuthenticationService
): () => Promise<void> {
  return () => authService.initializeOauthService();
}
