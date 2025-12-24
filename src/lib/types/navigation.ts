import type { LucideIcon } from 'lucide-react';

export type UserRole = 'gerencia' | 'compras' | 'contabilidad' | 'tecnico' | 'almacen';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface UserInfo {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
