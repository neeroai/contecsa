/**
 * @file Navigation by Role Configuration
 * @description Define estructuras de navegación según roles de usuario (gerencia, compras, contabilidad, tecnico, almacen)
 * @module lib/navigation
 * @exports navigationByRole, roleLabels
 */

import {
  BarChart3,
  Boxes,
  CheckSquare,
  ClipboardList,
  DollarSign,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Package,
  ScanText,
  ShoppingCart,
  TrendingUp,
  Truck,
  Wrench,
} from 'lucide-react';
import type { NavGroup, UserRole } from './types/navigation';

/**
 * Navigation structure per user role configuration
 * Maps each role (gerencia, compras, contabilidad, tecnico, almacen) to menu items
 *
 * @example
 * ```ts
 * const gerenciaNav = navigationByRole['gerencia'];
 * // Returns navigation groups with Dashboard, Proyectos, Presupuesto, EVM
 * gerenciaNav.forEach(group => console.log(group.title));
 * ```
 */
export const navigationByRole: Record<UserRole, NavGroup[]> = {
  gerencia: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          href: '/dashboard/gerencia',
          icon: LayoutDashboard,
        },
        {
          title: 'Proyectos',
          href: '/proyectos',
          icon: FolderKanban,
        },
        {
          title: 'Presupuesto',
          href: '/presupuesto',
          icon: DollarSign,
        },
        {
          title: 'EVM & Analisis',
          href: '/evm',
          icon: TrendingUp,
        },
      ],
    },
  ],
  compras: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          href: '/dashboard/compras',
          icon: LayoutDashboard,
        },
        {
          title: 'Seguimiento Compras',
          href: '/compras',
          icon: ShoppingCart,
          badge: 3,
        },
        {
          title: 'Inventario',
          href: '/inventario',
          icon: Package,
        },
        {
          title: 'Analisis de Precios',
          href: '/precios',
          icon: BarChart3,
        },
      ],
    },
  ],
  contabilidad: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          href: '/dashboard/contabilidad',
          icon: LayoutDashboard,
        },
        {
          title: 'Facturas',
          href: '/facturas',
          icon: FileText,
          badge: 5,
        },
        {
          title: 'OCR Facturas',
          href: '/ocr',
          icon: ScanText,
        },
        {
          title: 'Validacion',
          href: '/validacion',
          icon: CheckSquare,
        },
      ],
    },
  ],
  tecnico: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          href: '/dashboard/tecnico',
          icon: LayoutDashboard,
        },
        {
          title: 'Requisiciones',
          href: '/requisiciones',
          icon: ClipboardList,
        },
        {
          title: 'Consumo Materiales',
          href: '/consumo',
          icon: Boxes,
        },
        {
          title: 'Mantenimiento',
          href: '/mantenimiento',
          icon: Wrench,
        },
      ],
    },
  ],
  almacen: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          href: '/dashboard/almacen',
          icon: LayoutDashboard,
        },
        {
          title: 'Inventario',
          href: '/inventario',
          icon: Package,
        },
        {
          title: 'Movimientos',
          href: '/movimientos',
          icon: Truck,
        },
        {
          title: 'Control Stock',
          href: '/stock',
          icon: Boxes,
        },
      ],
    },
  ],
};

/**
 * Human-readable labels for user roles used in UI
 * Provides display names for role dropdowns and selection dialogs
 *
 * @example
 * ```ts
 * roleLabels['gerencia'] // 'Gerencia'
 * roleLabels['compras'] // 'Compras'
 * const label = roleLabels[userRole]; // Dynamic lookup
 * ```
 */
export const roleLabels: Record<UserRole, string> = {
  gerencia: 'Gerencia',
  compras: 'Compras',
  contabilidad: 'Contabilidad',
  tecnico: 'Tecnico',
  almacen: 'Almacen',
};
