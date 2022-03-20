import { Permission } from '../enums/permission.enum';

export interface UserSettings {
  permissions?: Permission[];
  locale?: 'en' | 'cs';
  homeTimeZone?: string;
  currentTimeZone?: string;
  administrationMode?: boolean;
  useWebService?: boolean;
}
