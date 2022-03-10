export interface ColumnData<T> {
  row: T;
  columnName: keyof T;
}
