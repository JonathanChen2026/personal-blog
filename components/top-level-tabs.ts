export const TOP_LEVEL_TABS = [
  { key: 'home', href: '/', label: 'JONATHAN CHEN' },
  { key: 'about', href: '/about', label: 'ABOUT' },
  { key: 'thoughts', href: '/thoughts', label: 'THOUGHTS' },
  { key: 'projects', href: '/projects', label: 'PROJECTS' },
  { key: 'contact', href: '/contact', label: 'CONTACT' },
] as const;

export type TopLevelTab = (typeof TOP_LEVEL_TABS)[number];
export type TabKey = TopLevelTab['key'];
export type TopLevelHref = TopLevelTab['href'];

export function getTopLevelTabIndex(pathname: string | null | undefined) {
  const index = TOP_LEVEL_TABS.findIndex((tab) => tab.href === pathname);
  return index === -1 ? null : index;
}

export function getTopLevelHref(pathname: string | null | undefined) {
  const index = getTopLevelTabIndex(pathname);
  return index === null ? null : TOP_LEVEL_TABS[index].href;
}
