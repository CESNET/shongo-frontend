export interface IdentityClaims {
  acr: string;
  aud: string;
  auth_time: number;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  kid: string;
  locale: string;
  name: string;
  nonce: string;
  sub: string;
  zoneInfo: string;
  isCesnetEligibleLastSeen?: string;
}
