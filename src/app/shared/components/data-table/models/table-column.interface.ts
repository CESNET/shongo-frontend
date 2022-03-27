import { Type } from '@angular/core';
import { ColumnComponent } from '../column-components/column.component';

export type PipeFunction = (value: unknown) => string;

export interface TableColumn<T> {
  name: string;
  displayName: string;
  component?: Type<ColumnComponent<T>>;
  pipeFunc?: PipeFunction;
}
