import { WithPathTemplate } from '../models/interfaces/with-path-template.interface';
import { IsDisabledFunction, TableButton } from './table-button';

export class LinkButton<T> extends TableButton<T> implements WithPathTemplate {
  constructor(
    public name: string,
    public icon: string,
    public pathTemplate: string,
    public isDisabledFunc?: IsDisabledFunction<T>
  ) {
    super(isDisabledFunc);
  }
}
