export interface Group {
  id: string;
  name: string;
  administrators: unknown[];
  description?: string;
  parentGroupId?: string;
  secondaryId?: string;
}
