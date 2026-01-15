/**
 * @file Navigation Type Definitions
 * @description Define tipos para estructura de navegación, roles de usuario e información de perfil
 * @module lib/types/navigation
 * @exports UserRole, NavItem, NavGroup, UserInfo
 */

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
