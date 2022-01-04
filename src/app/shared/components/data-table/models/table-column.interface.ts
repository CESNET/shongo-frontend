import { ColumnComponent } from '../column-components/column.component';

export type PipeFunction = (value: unknown) => string;

export interface TableColumn {
  name: string;
  displayName: string;
  component?: typeof ColumnComponent;
  pipeFunc?: PipeFunction;
}
