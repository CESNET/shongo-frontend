import { ItemAuthorization } from '../enums/item-authorization.enum';

export interface MenuItem {
  label: string;
  itemAuth: ItemAuthorization;
  hideOnTablet?: boolean;
  route?: string;
  externalRoute?: boolean;
  func?: () => void;
  subItems?: MenuItem[];
  subMenuOpen?: boolean;
}
