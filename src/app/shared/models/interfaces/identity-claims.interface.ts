export interface IdentityClaims {
  sub: string;
  kid: string;
  iss: string;
  given_name: string;
  nonce: string;
  aud: string;
  acr: string;
  auth_time: number;
  name: string;
  exp: number;
  iat: number;
  family_name: string;
  jti: string;
  email: string;
}
