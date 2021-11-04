import { Observable, of } from 'rxjs';
import { DataTableDataSource } from 'src/app/shared/components/data-table/data-source/data-table-datasource';
import { ApiResponse } from 'src/app/shared/models/api-responses/api-response.interface';

export interface DataTableDataStub {
  id: string;
}

const MOCK_RESPONSE: ApiResponse<DataTableDataStub> = {
  count: 5,
  items: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }],
};

export class DataTableDatasourceStub extends DataTableDataSource<DataTableDataStub> {
  displayedColumns = [{ name: 'id', displayName: 'ID' }];

  constructor() {
    super();
  }

  getData(): Observable<ApiResponse<DataTableDataStub>> {
    return of(MOCK_RESPONSE);
  }
}
