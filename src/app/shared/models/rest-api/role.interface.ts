import { IdentityType } from '../enums/identity-type.enum';

export interface Role {
  id: string;
  identityType: IdentityType;
  entityId: string;
  identityName: string;
  identityDescription: string;
  role: string;
  deletable: boolean;
  email?: string;
}
