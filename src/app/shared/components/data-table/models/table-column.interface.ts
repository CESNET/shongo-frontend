export type PipeFunction = (value: unknown) => string;

export interface TableColumn {
  name: string;
  displayName: string;
  pipeFunc?: PipeFunction;
}
