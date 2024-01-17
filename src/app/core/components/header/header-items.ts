import { ItemAuthorization } from 'src/app/models/enums/item-authorization.enum';
import { LocaleItem } from 'src/app/models/interfaces/locale-item.interface';
import { MenuItem } from 'src/app/models/interfaces/menu-item.interface';
import { Locale } from 'src/app/shared/models/enums/locale.enum';

/**
 * Navigation items displayed inside header navigation.
 */
export const menuItems: MenuItem[] = [
  {
    label: $localize`:navbar link|Link to reservations:Reserve`,
    route: '/reserve',
    itemAuth: ItemAuthorization.LOGGED_IN,
  },
  {
    label: $localize`:navbar link|Link to resource management:Resource management`,
    route: '/',
    itemAuth: ItemAuthorization.ADMIN,
    subItems: [
      {
        label: $localize`:navbar link|Sublink in resource management:Resource capacity utilization`,
        route: '/resource-management/capacity-utilization',
        itemAuth: ItemAuthorization.ADMIN,
      },
    ],
  },
  {
    label: $localize`:navbar link|Link to help page:Help`,
    route: '/help',
    itemAuth: ItemAuthorization.NONE,
    hideOnTablet: true,
  },
  {
    label: $localize`:navbar link|Link to documentation page:Documentation`,
    route: 'https://vidcon.cesnet.cz/?back-url=/',
    externalRoute: true,
    itemAuth: ItemAuthorization.NONE,
    hideOnTablet: true,
  },
  {
    label: $localize`:navbar link|Link to report page:Report a problem`,
    route: '/help/report',
    itemAuth: ItemAuthorization.LOGGED_IN,
    hideOnTablet: true,
  },
];

/**
 * Items in locale selection.
 */
export const locales: LocaleItem[] = [
  {
    value: Locale.EN,
    icon: 'flag-en',
    name: $localize`:en language|EN language in locale picker:English language`,
  },
  {
    value: Locale.CS,
    icon: 'flag-cz',
    name: $localize`:cz language|CZ language in locale picker:Czech language`,
  },
];
