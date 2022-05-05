import { Type } from '@angular/core';
import { ColumnComponent } from '../column-components/column.component';

export type PipeFunction = (value: unknown) => string;

export interface TableColumn<T> {
  /**
   * Column name as specified in response model.
   */
  name: string;

  /**
   * Column name as should be displayed inside the table.
   */
  displayName: string;

  /**
   * Component which should be used to display table data for this column.
   */
  component?: Type<ColumnComponent<T>>;

  /**
   * Help component with explanation for column data.
   */
  helpComponent?: Type<unknown>;

  /**
   * Transformation function for column data.
   */
  pipeFunc?: PipeFunction;
}
