import { UserSettings } from 'src/app/shared/models/rest-api/user-settings.interface';

export interface ReportMetadata
  extends Omit<UserSettings, 'homeTimeZone currentTimeZone'> {
  user?: string;
  userEmail?: string;
  timezone?: string;
}
