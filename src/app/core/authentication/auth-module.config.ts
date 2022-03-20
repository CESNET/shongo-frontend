import { OAuthModuleConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';

export const authModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    allowedUrls: [
      `http${environment.useHttps ? 's' : ''}://${
        environment.shongoRESTApiHost
      }:${environment.shongoRESTApiPort}`,
    ],
    sendAccessToken: true,
  },
};
