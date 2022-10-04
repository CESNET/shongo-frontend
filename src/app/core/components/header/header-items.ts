import { ItemAuthorization } from 'src/app/models/enums/item-authorization.enum';
import { MenuItem } from 'src/app/models/interfaces/menu-item.interface';
import { LocaleItem } from 'src/app/models/interfaces/locale-item.interface';

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
    itemAuth: ItemAuthorization.NONE,
    hideOnTablet: true,
  },
];

/**
 * Items in locale selection.
 */
export const locales: LocaleItem[] = [
  {
    shortcut: 'cz',
    icon: 'assets/img/i18n/CZ.svg',
    route: '/cz',
    name: $localize`:cz language|CZ language in locale picker:Czech language`,
  },
  {
    shortcut: 'en',
    icon: 'assets/img/i18n/GB.svg',
    route: '/en',
    name: $localize`:en language|EN language in locale picker:English language`,
  },
];
