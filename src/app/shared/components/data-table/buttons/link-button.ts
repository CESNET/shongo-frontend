import { TableButton } from './table-button';

export class LinkButton<T> extends TableButton {
  icon: string;
  name: string;
  pathTemplate: string;

  constructor(name: string, icon: string, pathTemplate: string) {
    super();
    this.name = name;
    this.icon = icon;
    this.pathTemplate = pathTemplate;
  }

  constructPath(row: T): string {
    const segments = this.pathTemplate.split('/');
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
