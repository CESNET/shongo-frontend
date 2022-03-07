export interface RequestModification {
  id: string;
  createdAt: string;
  createdBy: string;
  type: string;
  allocationState: string;
  state: string;
  isActive: boolean;
  isLatestAllocated: boolean;
}
