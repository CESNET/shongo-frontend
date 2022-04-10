import { Observable, of } from 'rxjs';
import { DataTableDataSource } from 'src/app/modules/shongo-table/data-sources/data-table-datasource';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';

export interface DataTableDataStub {
  id: string;
}

const MOCK_RESPONSE: ApiResponse<DataTableDataStub> = {
  count: 5,
  items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }],
};

export class DataTableDatasourceStub extends DataTableDataSource<DataTableDataStub> {
  displayedColumns = [{ name: 'id', displayName: 'ID' }];
  buttons = [];

  constructor() {
    super();
  }

  getData(): Observable<ApiResponse<DataTableDataStub>> {
    return of(MOCK_RESPONSE);
  }
}
