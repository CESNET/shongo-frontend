export type RowPredicate<T> = (row: T) => boolean;

/**
 * Class representing a table button.
 */
export abstract class TableButton<T> {
  /**
   * Button name, used for tooltip and accessibility.
   */
  abstract name: string;

  /**
   * Button icon, expects material icon name.
   */
  abstract icon: string;

  constructor(
    /**
     * Predicate function which specifies whether button should be disabled.
     */
    public isDisabledFunc?: RowPredicate<T>,

    /**
     * Predicate function which specifies whether button should be displayed.
     */
    public displayButtonFunc?: RowPredicate<T>
  ) {}

  /**
   * Constructs path with data defined in row.
   *
   * Example:
   * - Row data: { id: 1 }
   * - Path template: /user/:id
   * - Resulting path: /user/1
   *
   * Example 2:
   * - Row data: { user: { name: 'joe' }}
   * - Path template: /user/:user.name
   * - Resulting path: /user/joe
   *
   * @param row Table row.
   * @param pathTemplate Path template.
   * @returns Constructed path.
   */
  constructPath(row: T, pathTemplate: string): string {
    const segments = pathTemplate.split('/');
    return segments
      .map((segment) => this._constructSegment(segment, row))
      .join('/');
  }

  /**
   * Constructs path segment. Segment is a part of path template between 2 '/' symbols.
   *
   * Path segment starting with ':' gets replaced by a property from row, corresponding to segment name.
   * Segment can also contain sub properties delimited with '.' symbol.
   *
   * Example:
   * - Row data: { id: 1 }
   * - Segment template: :id
   * - Resulting path: 1
   *
   * Example 2:
   * - Row data: { user: { name: 'joe' }}
   * - Segment template: :user.name
   * - Resulting path: joe
   *
   * @param segment Path segment.
   * @param row Table row.
   * @returns Filled out segment.
   */
  private _constructSegment(segment: string, row: T): string {
    if (segment.startsWith(':')) {
      segment = segment.substring(1);
      const pathSegments = segment.split('.');
      return pathSegments.reduce((acc: any, cur) => acc[cur], row);
    }
    return segment;
  }
}
