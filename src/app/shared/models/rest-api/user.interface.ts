export interface User {
  userId: string;
  principalNames: string[];
  firstName: string;
  lastName: string;
  organization?: string;
  email: string;
  fullName: string;
  locale: string;
  zoneInfo: string;
  eduPersonEntitlement: string[];
  rootOrganization: string;
  primaryEmail: string;
  className: string;
}
