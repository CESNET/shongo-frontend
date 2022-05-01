import { UserSettings } from 'src/app/shared/models/rest-api/user-settings.interface';

export interface ReportMetadata {
  settings?: UserSettings;
  timezone?: string;
  user?: string;
  email?: string;
}
