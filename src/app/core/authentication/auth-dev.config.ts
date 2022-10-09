import { AuthConfig } from 'angular-oauth2-oidc';

/**
 * Configuration for OAuth service.
 */
export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8080/default',
  redirectUri: window.location.origin,
  clientId: '49ae627d-7b2e-4052-8421-bcc16ee0c3d6',
  responseType: 'code',
  scope:
    'openid email profile organization offline_access eduperson_entitlement voperson_external_id isCesnetEligibleLastSeen',
  showDebugInformation: true,
};
