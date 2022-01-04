export interface MenuItem {
  label: string;
  showItem: ShowItem;
  route?: string;
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

export enum ShowItem {
  LOGGED_IN,
  LOGGED_OUT,
  BOTH,
}

export const menuItems: MenuItem[] = [
  {
    label: $localize`:navbar link|Link to help page:Help`,
    route: '/',
    showItem: ShowItem.BOTH,
  },
  {
    label: $localize`:navbar link|Link to documentation page:Documentation`,
    route: '/',
    showItem: ShowItem.BOTH,
  },
  {
    label: $localize`:navbar link|Link to resource management:Resource management`,
    route: '/',
    showItem: ShowItem.LOGGED_IN,
    subItems: [
      {
        label: $localize`:navbar link|Sublink in resource management:Resource capacity utilization`,
        route: '/',
        showItem: ShowItem.LOGGED_IN,
      },
      {
        label: $localize`:navbar link|Sublink in resource management:Resource reservations`,
        route: '/',
        showItem: ShowItem.LOGGED_IN,
      },
    ],
  },
  {
    label: $localize`:navbar link|Link to reservations:Reserve`,
    route: '/',
    showItem: ShowItem.LOGGED_IN,
    subItems: [
      {
        label: $localize`:navbar link|Sublink in reservations:Meeting room`,
        route: '/',
        showItem: ShowItem.LOGGED_IN,
      },
      {
        label: $localize`:navbar link|Sublink in reservations:Parking place`,
        route: '/',
        showItem: ShowItem.LOGGED_IN,
      },
    ],
  },
  {
    label: $localize`:navbar link|Link to resource creation:Create`,
    route: '/',
    showItem: ShowItem.LOGGED_IN,
    subItems: [
      {
        label: $localize`:navbar link|Sublink in resource creation:Virtual room`,
        route: '/',
        showItem: ShowItem.LOGGED_IN,
      },
    ],
  },
];

export const accountItems: MenuItem[] = [
  {
    label: $localize`:navbar link|Sublink in account:Settings`,
    route: '/',
    showItem: ShowItem.LOGGED_IN,
  },
  {
    label: $localize`:navbar link|Sublink in account:Log out`,
    showItem: ShowItem.LOGGED_IN,
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
