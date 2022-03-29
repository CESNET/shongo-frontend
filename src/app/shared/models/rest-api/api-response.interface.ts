export interface ApiResponse<T> {
  count: number;
  items: T[];
  error?: boolean;
}
