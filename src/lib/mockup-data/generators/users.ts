/**
 * Users Data Generator
 * Contecsa Sistema de Inteligencia de Datos
 *
 * Version: 1.0 | Date: 2025-12-24 13:00
 *
 * Generates 10 users across 5 roles.
 * Includes Liced Vega (Compras - super user) as specified in requirements.
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
 * Generate a single user
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
 * Generates all 10 users
 * Distribution: 2 Gerencia, 3 Compras, 1 Contabilidad, 1 Técnico, 2 Almacén, 1 Inactive
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
 * Helper: Get user by role
 */
export function getUsersByRole(role: Role): User[] {
  return USERS.filter((user) => user.role === role && user.isActive);
}

/**
 * Helper: Get specific user by name
 */
export function getUserByName(firstName: string, lastName: string): User | undefined {
  return USERS.find(
    (user) => user.firstName === firstName && user.lastName === lastName && user.isActive,
  );
}

/**
 * Helper: Get Liced Vega (super user)
 */
export function getLicedVega(): User {
  const liced = getUserByName('Liced', 'Vega');
  if (!liced) {
    throw new Error('Liced Vega not found in users');
  }
  return liced;
}

/**
 * Helper: Get random user by role
 */
export function getRandomUserByRole(role: Role): User {
  const roleUsers = getUsersByRole(role);
  return rng.pick(roleUsers);
}
