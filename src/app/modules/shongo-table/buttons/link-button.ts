import { WithPathTemplate } from '../models/interfaces/with-path-template.interface';
import { RowPredicate, TableButton } from './table-button';

/**
 * Button for navigating to a defined route.
 */
export class LinkButton<T> extends TableButton<T> implements WithPathTemplate {
  constructor(
    public name: string,
    public icon: string,
    public pathTemplate: string,
    public isDisabledFunc?: RowPredicate<T>,
    public displayButtonFunc?: RowPredicate<T>
  ) {
    super(isDisabledFunc, displayButtonFunc);
  }
}
