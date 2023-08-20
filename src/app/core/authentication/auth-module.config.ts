import { OAuthModuleConfig } from 'angular-oauth2-oidc';

/**
 * Configures sending access token with any request to resource server.
 */
export const authModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    allowedUrls: [
      'https://shongo-dev.cesnet.cz/',
      'https://meethings.cesnet.cz/',
    ],
    sendAccessToken: true,
  },
};
