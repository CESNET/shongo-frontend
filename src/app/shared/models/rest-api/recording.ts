export interface Recording {
  id: string;
  resourceId: string;
  name: string;
  description: string;
  isPublic: boolean;
  beginDate: string;
  duration: number;
  downloadUrl: string;
  viewUrl: string;
  editUrl: string;
  filename: string;
}
