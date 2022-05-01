import { ReportMetadata } from './report-metadata.interface';

export interface Report {
  meta: ReportMetadata;
  email: string;
  message: string;
}
