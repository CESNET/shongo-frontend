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

export interface Locale {
  shortcut: string;
  icon: string;
  route: string;
  name: string;
}

export enum ItemAuthorization {
  LOGGED_IN,
  LOGGED_OUT,
  BOTH,
}

export const menuItems: MenuItem[] = [
  {
    label: $localize`:navbar link|Link to help page:Help`,
    route: '/help',
    itemAuth: ItemAuthorization.BOTH,
    hideOnTablet: true,
  },
  {
    label: $localize`:navbar link|Link to documentation page:Documentation`,
    route: 'https://vidcon.cesnet.cz/?back-url=/',
    externalRoute: true,
    itemAuth: ItemAuthorization.BOTH,
    hideOnTablet: true,
  },
  {
    label: $localize`:navbar link|Link to report page:Report a problem`,
    route: '/report',
    itemAuth: ItemAuthorization.BOTH,
    hideOnTablet: true,
  },
  {
    label: $localize`:navbar link|Link to resource management:Resource management`,
    route: '/',
    itemAuth: ItemAuthorization.LOGGED_IN,
    subItems: [
      {
        label: $localize`:navbar link|Sublink in resource management:Resource capacity utilization`,
        route: '/resource-management/capacity-utilization',
        itemAuth: ItemAuthorization.LOGGED_IN,
      },
      {
        label: $localize`:navbar link|Sublink in resource management:Resource reservations`,
        route: '/',
        itemAuth: ItemAuthorization.LOGGED_IN,
      },
    ],
  },
  {
    label: $localize`:navbar link|Link to reservations:Reserve`,
    route: '/',
    itemAuth: ItemAuthorization.LOGGED_IN,
    subItems: [
      {
        label: $localize`:navbar link|Sublink in reservations:Meeting room`,
        route: '/',
        itemAuth: ItemAuthorization.LOGGED_IN,
      },
      {
        label: $localize`:navbar link|Sublink in reservations:Parking place`,
        route: '/',
        itemAuth: ItemAuthorization.LOGGED_IN,
      },
    ],
  },
  {
    label: $localize`:navbar link|Link to resource creation:Create`,
    route: '/',
    itemAuth: ItemAuthorization.LOGGED_IN,
    subItems: [
      {
        label: $localize`:navbar link|Sublink in resource creation:Virtual room`,
        route: '/',
        itemAuth: ItemAuthorization.LOGGED_IN,
      },
    ],
  },
];

export const accountItems: MenuItem[] = [
  {
    label: $localize`:navbar link|Sublink in account:Settings`,
    route: '/user/settings',
    itemAuth: ItemAuthorization.LOGGED_IN,
  },
  {
    label: $localize`:navbar link|Sublink in account:Log out`,
    itemAuth: ItemAuthorization.LOGGED_IN,
  },
];

export const locales: Locale[] = [
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
