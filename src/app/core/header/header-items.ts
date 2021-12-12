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
    label: $localize`:navbar link|Link to help page:Nápověda`,
    route: '/',
    showItem: ShowItem.BOTH,
  },
  {
    label: $localize`:navbar link|Link to documentation page:Dokumentace`,
    route: '/',
    showItem: ShowItem.BOTH,
  },
  {
    label: $localize`:navbar link|Link to resource management:Správa zdrojů`,
    route: '/',
    showItem: ShowItem.LOGGED_IN,
    subItems: [
      {
        label: $localize`:navbar link|Sublink in resource management:Využití kapacity zdrojů`,
        route: '/',
        showItem: ShowItem.LOGGED_IN,
      },
      {
        label: $localize`:navbar link|Sublink in resource management:Rezervace zdrojů`,
        route: '/',
        showItem: ShowItem.LOGGED_IN,
      },
    ],
  },
  {
    label: $localize`:navbar link|Link to reservations:Rezervovat`,
    route: '/',
    showItem: ShowItem.LOGGED_IN,
    subItems: [
      {
        label: $localize`:navbar link|Sublink in reservations:Zasedací místnost`,
        route: '/',
        showItem: ShowItem.LOGGED_IN,
      },
      {
        label: $localize`:navbar link|Sublink in reservations:Parkovací místo`,
        route: '/',
        showItem: ShowItem.LOGGED_IN,
      },
    ],
  },
  {
    label: $localize`:navbar link|Link to resource creation:Vytvořit`,
    route: '/',
    showItem: ShowItem.LOGGED_IN,
    subItems: [
      {
        label: $localize`:navbar link|Sublink in resource creation:Virtuální místnost`,
        route: '/',
        showItem: ShowItem.LOGGED_IN,
      },
    ],
  },
];

export const accountItems: MenuItem[] = [
  {
    label: $localize`:navbar link|Sublink in account:Nastavení`,
    route: '/',
    showItem: ShowItem.LOGGED_IN,
  },
  {
    label: $localize`:navbar link|Sublink in account:Odhlásit se`,
    showItem: ShowItem.LOGGED_IN,
  },
];

export const locales: Locale[] = [
  {
    shortcut: 'cz',
    icon: 'assets/img/i18n/CZ.svg',
    route: '/cz',
    name: $localize`:cz language|CZ language in locale picker:Český jazyk`,
  },
  {
    shortcut: 'en',
    icon: 'assets/img/i18n/GB.svg',
    route: '/en',
    name: $localize`:en language|EN language in locale picker:Anglický jazyk`,
  },
];
