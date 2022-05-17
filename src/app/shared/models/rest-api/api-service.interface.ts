import { Observable } from 'rxjs';
import { ApiResponse } from './api-response.interface';

export interface EndpointService<T> {
  fetchItems(): Observable<ApiResponse<T>>;

  deleteItem(id: string): Observable<Record<string, never>>;
}
