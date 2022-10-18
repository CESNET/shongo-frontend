import { Permission } from '../enums/permission.enum';

export interface UserSettings {
  permissions?: Permission[];
  useWebService?: boolean;
  administrationMode?: boolean;
  locale?: 'cz' | 'en';
  homeTimeZone?: string;
  currentTimeZone?: string;
}
