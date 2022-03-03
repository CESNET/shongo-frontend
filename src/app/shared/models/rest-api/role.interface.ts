import { IdentityType } from '../enums/identity-type.enum';

export interface Role {
  identityType: IdentityType;
  identityPrincipalId: string;
  identityName: string;
  identityDescription: string;
  role: string;
  deletable: boolean;
  email?: string;
}
