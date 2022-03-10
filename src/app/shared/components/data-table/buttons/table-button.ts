export type RowPredicate<T> = (row: T) => boolean;

export abstract class TableButton<T> {
  abstract name: string;
  abstract icon: string;

  constructor(
    public isDisabledFunc?: RowPredicate<T>,
    public displayButtonFunc?: RowPredicate<T>
  ) {}

  constructPath(row: T, pathTemplate: string): string {
    const segments = pathTemplate.split('/');
    return segments
      .map((segment) => this._constructSegment(segment, row))
      .join('/');
  }

  private _constructSegment(segment: string, row: T): string {
    if (segment.startsWith(':')) {
      segment = segment.substring(1);
      const pathSegments = segment.split('.');
      return pathSegments.reduce((acc: any, cur) => acc[cur], row);
    }
    return segment;
  }
}
