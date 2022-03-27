import { AliasType } from '../enums/alias-type.enum';

export interface Alias {
  type: AliasType;
  value: string;
}
