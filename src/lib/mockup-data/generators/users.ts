/**
 * @file Users Data Generator
 * @description Genera 10 usuarios con 5 roles incluyendo Liced Vega como super-usuario
 * @module lib/mockup-data/generators/users
 * @exports generateUsers, USERS, getUsersByRole, getUserByName, getLicedVega, getRandomUserByRole
 */

import type { Role, User } from '../types';
import {
  deterministicUUID,
  generateEmail,
  generatePhone,
  getCurrentDate,
  rng,
  subtractDays,
  subtractMonths,
} from './utils';

/**
 * Generate a single user with role and department
 * Creates user with email, phone, and activity tracking
 *
 * @param id - User ID (UUID format, usually deterministic)
 * @param firstName - First name, e.g., "Carlos"
 * @param lastName - Last name, e.g., "Rodríguez"
 * @param role - User role: gerencia, compras, contabilidad, tecnico, almacen
 * @param department - Department name, e.g., "Compras"
 * @param isActive - Default true, false for inactive users
 * @returns User object with contact info and role
 *
 * @example
 * ```ts
 * const user = generateUser(
 *   "user-123",
 *   "Liced",
 *   "Vega",
 *   "compras",
 *   "Compras"
 * );
 * console.log(user.role); // "compras"
 * ```
 */
export function generateUser(
  id: string,
  firstName: string,
  lastName: string,
  role: Role,
  department: string,
  isActive = true,
): User {
  const createdAt = subtractMonths(getCurrentDate(), rng.int(6, 36));
  const lastLogin = isActive ? subtractDays(getCurrentDate(), rng.int(0, 7)) : undefined;

  return {
    id,
    email: generateEmail(firstName, lastName),
    firstName,
    lastName,
    phone: generatePhone(true),
    role,
    department,
    organization: 'Contecsa',
    isActive,
    createdAt,
    updatedAt: lastLogin || createdAt,
    lastLogin,
  };
}

/**
 * Generate 10 users across all roles including Liced Vega as super user
 * Distribution: 2 Gerencia, 3 Compras, 1 Contabilidad, 1 Técnico, 2 Almacén, 1 Inactive
 *
 * @returns Array of 10 User objects with all roles represented
 *
 * @example
 * ```ts
 * const users = generateUsers();
 * console.log(users.length); // 10
 * const liced = users.find(u => u.firstName === 'Liced');
 * console.log(liced?.role); // "compras"
 * ```
 */
export function generateUsers(): User[] {
  const users: User[] = [];

  // GERENCIA (2 users)
  users.push(
    generateUser(
      deterministicUUID('user-gerencia-1'),
      'Carlos',
      'Rodríguez',
      'gerencia',
      'Dirección General',
    ),
  );

  users.push(
    generateUser(
      deterministicUUID('user-gerencia-2'),
      'María',
      'González',
      'gerencia',
      'Dirección Financiera',
    ),
  );

  // COMPRAS (3 users) - Including Liced Vega as super user
  users.push(
    generateUser(deterministicUUID('user-compras-liced'), 'Liced', 'Vega', 'compras', 'Compras'),
  );

  users.push(
    generateUser(deterministicUUID('user-compras-2'), 'Andrés', 'Martínez', 'compras', 'Compras'),
  );

  users.push(
    generateUser(deterministicUUID('user-compras-3'), 'Laura', 'Sánchez', 'compras', 'Compras'),
  );

  // CONTABILIDAD (1 user)
  users.push(
    generateUser(
      deterministicUUID('user-contabilidad-1'),
      'Diana',
      'Torres',
      'contabilidad',
      'Contabilidad',
    ),
  );

  // TECNICO (1 user)
  users.push(
    generateUser(deterministicUUID('user-tecnico-1'), 'Jorge', 'Ramírez', 'tecnico', 'Obras'),
  );

  // ALMACEN (2 users)
  users.push(
    generateUser(deterministicUUID('user-almacen-1'), 'Miguel', 'Pérez', 'almacen', 'Almacén'),
  );

  users.push(
    generateUser(deterministicUUID('user-almacen-2'), 'Carmen', 'López', 'almacen', 'Almacén'),
  );

  // INACTIVE USER (for testing)
  users.push(
    generateUser(
      deterministicUUID('user-inactive-1'),
      'Pedro',
      'Gómez',
      'compras',
      'Compras',
      false,
    ),
  );

  return users;
}

/**
 * Pre-generated users data
 */
export const USERS = generateUsers();

/**
 * Get all active users with a specific role
 * Filters only active users, excludes inactive test users
 *
 * @param role - Role filter: gerencia, compras, contabilidad, tecnico, almacen
 * @returns Array of active users in role, empty if none found
 *
 * @example
 * ```ts
 * const purchasing = getUsersByRole('compras');
 * console.log(purchasing.length); // 3
 * console.log(purchasing[0].firstName); // "Liced"
 * ```
 */
export function getUsersByRole(role: Role): User[] {
  return USERS.filter((user) => user.role === role && user.isActive);
}

/**
 * Get specific active user by first and last name
 * Returns undefined if user inactive or not found
 *
 * @param firstName - First name to search, e.g., "Liced"
 * @param lastName - Last name to search, e.g., "Vega"
 * @returns User object if found and active, undefined otherwise
 *
 * @example
 * ```ts
 * const liced = getUserByName('Liced', 'Vega');
 * console.log(liced?.role); // "compras"
 * ```
 */
export function getUserByName(firstName: string, lastName: string): User | undefined {
  return USERS.find(
    (user) => user.firstName === firstName && user.lastName === lastName && user.isActive,
  );
}

/**
 * Get Liced Vega (super user in purchasing department)
 * Throws if not found (should never happen with proper generation)
 *
 * @returns Liced Vega user object (role: compras)
 * @throws {Error} When Liced Vega not found in users
 *
 * @example
 * ```ts
 * const liced = getLicedVega();
 * console.log(liced.department); // "Compras"
 * console.log(liced.role); // "compras"
 * ```
 */
export function getLicedVega(): User {
  const liced = getUserByName('Liced', 'Vega');
  if (!liced) {
    throw new Error('Liced Vega not found in users');
  }
  return liced;
}

/**
 * Get random active user with specific role using seeded RNG
 * Deterministic - same user for same seed across calls
 *
 * @param role - Role filter: gerencia, compras, contabilidad, tecnico, almacen
 * @returns Random User with specified role, never undefined
 *
 * @example
 * ```ts
 * const randomBuyer = getRandomUserByRole('compras');
 * console.log(randomBuyer.firstName); // e.g., "Liced"
 * ```
 */
export function getRandomUserByRole(role: Role): User {
  const roleUsers = getUsersByRole(role);
  return rng.pick(roleUsers);
}
