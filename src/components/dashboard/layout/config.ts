import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Dashboard', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Gallaries', href: paths.dashboard.customers, icon: 'users' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
