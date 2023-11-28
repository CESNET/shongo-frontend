import { AuthenticationService } from './authentication/authentication.service';
import { ResourceService } from './http/resource/resource.service';

/**
 * Used to authenticate user and load available resources before app bootstrap.
 *
 * @param authService Authentication service.
 * @param resourceService Resource service.
 * @returns Promise which resolves after auth initialization.
 */
export function appInitializerFactory(
  authService: AuthenticationService,
  resourceService: ResourceService
): () => Promise<void> {
  return () =>
    authService.initializeOauthService().then(() => {
      if (authService.hasValidAccessToken()) {
        return resourceService.loadResources();
      }
      return Promise.resolve();
    });
}
