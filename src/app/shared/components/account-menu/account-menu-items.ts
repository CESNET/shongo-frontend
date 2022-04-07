import { ItemAuthorization } from 'src/app/models/enums/item-authorization.enum';
import { MenuItem } from 'src/app/models/interfaces/menu-item.interface';

export const accountMenuItems: MenuItem[] = [
  {
    label: $localize`:account menu link|Sublink in account:Settings`,
    route: '/user/settings',
    itemAuth: ItemAuthorization.LOGGED_IN,
  },
  {
    label: $localize`:account menu link|Sublink in account:Log out`,
    itemAuth: ItemAuthorization.LOGGED_IN,
  },
];
