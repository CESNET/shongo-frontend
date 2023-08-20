import { ERequestState } from '../enums/request-state.enum';

export interface IRequest<T> {
  data: T;
  state: ERequestState;
}
