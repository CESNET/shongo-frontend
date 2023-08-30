import { environment } from '@env/environment';
import { OAuthModuleConfig } from 'angular-oauth2-oidc';

/**
 * Configures sending access token with any request to resource server.
 */
export const authModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    allowedUrls: [environment.host],
    sendAccessToken: true,
  },
};
