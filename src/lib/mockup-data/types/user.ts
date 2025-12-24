/**
 * User and Role Types
 * Contecsa Sistema de Inteligencia de Datos
 *
 * Version: 1.0 | Date: 2025-12-24 12:00
 *
 * Defines user roles, permissions, and profile information.
 * 5 roles: Gerencia, Compras, Contabilidad, Técnico, Almacén
 */

import { z } from 'zod';

/**
 * Role enum - 5 roles across Contecsa organization
 */
export type Role = 'gerencia' | 'compras' | 'contabilidad' | 'tecnico' | 'almacen';

export const RoleEnum = {
  GERENCIA: 'gerencia' as const,
  COMPRAS: 'compras' as const,
  CONTABILIDAD: 'contabilidad' as const,
  TECNICO: 'tecnico' as const,
  ALMACEN: 'almacen' as const,
} as const;

/**
 * Role metadata for UI and permissions
 */
export interface RoleMetadata {
  readonly label: string;
  readonly description: string;
  readonly color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export const ROLE_METADATA: Record<Role, RoleMetadata> = {
  gerencia: {
    label: 'Gerencia',
    description: 'Directores y gerentes - visión ejecutiva',
    color: 'blue',
  },
  compras: {
    label: 'Compras',
    description: 'Equipo de compras y adquisiciones',
    color: 'green',
  },
  contabilidad: {
    label: 'Contabilidad',
    description: 'Equipo de contabilidad y finanzas',
    color: 'purple',
  },
  tecnico: {
    label: 'Técnico',
    description: 'Equipo técnico de obras',
    color: 'orange',
  },
  almacen: {
    label: 'Almacén',
    description: 'Personal de almacén e inventario',
    color: 'red',
  },
};

/**
 * User model with contact, role, and organization info
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone?: string;
  readonly role: Role;
  readonly department: string;
  readonly organization: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly lastLogin?: Date;
}

/**
 * User profile with extended info
 */
export interface UserProfile extends User {
  readonly bio?: string;
  readonly avatar?: string;
  readonly preferences: UserPreferences;
}

/**
 * User preferences and settings
 */
export interface UserPreferences {
  readonly language: 'es' | 'en';
  readonly timezone: string;
  readonly theme: 'light' | 'dark';
  readonly emailNotifications: boolean;
  readonly pushNotifications: boolean;
  readonly notificationFrequency: 'instant' | 'daily' | 'weekly';
}

/**
 * Authentication session
 */
export interface AuthSession {
  readonly id: string;
  readonly userId: string;
  readonly email: string;
  readonly role: Role;
  readonly expiresAt: Date;
  readonly createdAt: Date;
  readonly userAgent?: string;
  readonly ipAddress?: string;
}

/**
 * Zod Schema: Role validation
 */
export const RoleSchema = z.enum(['gerencia', 'compras', 'contabilidad', 'tecnico', 'almacen']);

/**
 * Zod Schema: User Preferences validation
 */
export const UserPreferencesSchema = z.object({
  language: z.enum(['es', 'en']),
  timezone: z.string().min(1),
  theme: z.enum(['light', 'dark']),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  notificationFrequency: z.enum(['instant', 'daily', 'weekly']),
});

/**
 * Zod Schema: User validation
 */
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  role: RoleSchema,
  department: z.string().min(1),
  organization: z.string().min(1),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLogin: z.date().optional(),
});

/**
 * Zod Schema: User Profile validation
 */
export const UserProfileSchema = UserSchema.extend({
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
  preferences: UserPreferencesSchema,
});

/**
 * Zod Schema: Auth Session validation
 */
export const AuthSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  email: z.string().email(),
  role: RoleSchema,
  expiresAt: z.date(),
  createdAt: z.date(),
  userAgent: z.string().optional(),
  ipAddress: z.string().ip().optional(),
});

/**
 * Type inference from Zod schemas
 */
export type UserPreferencesType = z.infer<typeof UserPreferencesSchema>;
export type UserType = z.infer<typeof UserSchema>;
export type UserProfileType = z.infer<typeof UserProfileSchema>;
export type AuthSessionType = z.infer<typeof AuthSessionSchema>;
