export interface TableButton<T> {
  icon: string;
  tooltip: string;
  name: string;

  executeAction(row: T): void;
}
