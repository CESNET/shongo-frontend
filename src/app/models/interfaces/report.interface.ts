import { ReportMetadata } from './report-metadata.interface';

export interface Report {
  meta: ReportMetadata;
  message: string;
}
