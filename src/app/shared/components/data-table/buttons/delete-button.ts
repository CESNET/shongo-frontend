import { ApiService } from 'src/app/core/http/api.service';
import { HasID } from '../models/has-id.interface';
import { TableButton } from '../models/table-button.interface';

export class DeleteButton<T extends HasID> implements TableButton<T> {
  icon = 'delete';
  name = 'delete';
  tooltip = 'Delete item';

  constructor(private _apiService: ApiService) {}

  executeAction(row: T): void {
    this._apiService.deleteItem(row.id);
  }
}
