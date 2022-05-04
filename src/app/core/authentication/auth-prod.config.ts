import { AuthConfig } from 'angular-oauth2-oidc';

/**
 * Production configuration for OAuth service.
 */
export const authConfig: AuthConfig = {
  issuer: 'https://login.cesnet.cz/oidc/',
  redirectUri: window.location.origin + '/oauth2callback',
  clientId: '49ae627d-7b2e-4052-8421-bcc16ee0c3d6',
  responseType: 'code',
  scope:
    'openid email profile organization offline_access eduperson_entitlement voperson_external_id isCesnetEligibleLastSeen',
  showDebugInformation: true,
};
