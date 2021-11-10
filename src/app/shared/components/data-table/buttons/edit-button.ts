import { HasID } from '../models/has-id.interface';
import { TableButton } from '../models/table-button.interface';

export class EditButton<T extends HasID> implements TableButton<T> {
  icon = 'edit';
  name = 'edit';
  tooltip = 'Edit item';

  constructor() {}

  executeAction(row: T): void {
    console.log(row);
  }
}
