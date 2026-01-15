/**
 * @file Mockup Data Summary and Validation
 * @description Proporciona estadísticas y validación de datos de mockup (sin importaciones circulares)
 * @module lib/mockup-data/generators/stats
 * @exports getMockupDataSummary, validateMockupData, MOCKUP_DATA
 */

import { CONSORCIOS, PROJECTS } from './consorcios';
import { INVOICES } from './invoices';
import { MATERIALS } from './materials';
import { PURCHASES } from './purchases';
import { SUPPLIERS } from './suppliers';
import { USERS } from './users';

// ============================================================================
// SUMMARY STATS
// ============================================================================

/**
 * Get summary of all generated mockup data with entity counts
 * Quick overview of total users, suppliers, consorcios, projects, materials, purchases, invoices
 *
 * @returns Object with count properties for all data entities
 *
 * @example
 * ```ts
 * const summary = getMockupDataSummary();
 * console.log(summary.users); // 10
 * console.log(summary.purchases); // 55
 * console.log(summary.invoices); // 198
 * ```
 */
export function getMockupDataSummary() {
  return {
    users: USERS.length,
    suppliers: SUPPLIERS.length,
    consorcios: CONSORCIOS.length,
    projects: PROJECTS.length,
    materials: MATERIALS.length,
    purchases: PURCHASES.length,
    invoices: INVOICES.length,
  };
}

/**
 * Validate all generated mockup data for consistency and completeness
 * Checks: user count, Liced Vega exists, suppliers, consorcios, materials, purchases, invoices
 *
 * @returns Validation result with isValid flag, errors array, and warnings array
 *
 * @example
 * ```ts
 * const validation = validateMockupData();
 * console.log(validation.isValid); // true/false
 * console.log(validation.errors); // Critical issues
 * console.log(validation.warnings); // Non-critical issues
 * ```
 */
export function validateMockupData(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check users
  if (USERS.length !== 10) {
    errors.push(`Expected 10 users, got ${USERS.length}`);
  }

  const licedExists = USERS.some((u) => u.firstName === 'Liced' && u.lastName === 'Vega');
  if (!licedExists) {
    errors.push('Liced Vega not found in users');
  }

  // Check suppliers
  if (SUPPLIERS.length < 20) {
    warnings.push(`Expected 20+ suppliers, got ${SUPPLIERS.length}`);
  }

  // Check consorcios
  if (CONSORCIOS.length !== 9) {
    errors.push(`Expected 9 consorcios, got ${CONSORCIOS.length}`);
  }

  // Check materials
  if (MATERIALS.length < 30) {
    warnings.push(`Expected 30+ materials, got ${MATERIALS.length}`);
  }

  // Check purchases
  if (PURCHASES.length !== 55) {
    errors.push(`Expected 55 purchases, got ${PURCHASES.length}`);
  }

  const overduePurchases = PURCHASES.filter((p) => p.isOverdue);
  if (overduePurchases.length < 15) {
    warnings.push(`Expected 15+ overdue purchases, got ${overduePurchases.length}`);
  }

  const criticalPurchases = PURCHASES.filter((p) => p.daysInProcess > 45);
  if (criticalPurchases.length < 3) {
    warnings.push(`Expected 3+ critical purchases (>45d), got ${criticalPurchases.length}`);
  }

  // Check invoices
  if (INVOICES.length !== 198) {
    errors.push(`Expected 198 invoices, got ${INVOICES.length}`);
  }

  const casoCartagena = INVOICES.filter(
    (i) => i.anomalySeverity === 'CRIT' && i.status === 'ANOMALY_DETECTED',
  );
  if (casoCartagena.length < 3) {
    warnings.push(`Expected 3+ Caso Cartagena invoices, got ${casoCartagena.length}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Complete mockup dataset with all generated entities (as const)
 * Includes: 10 users, 20+ suppliers, 9 consorcios, 15 projects, 30+ materials, 55 purchases, 198 invoices
 * Type: readonly object for immutability, supports type inference
 *
 * @example
 * ```ts
 * const { users, invoices } = MOCKUP_DATA;
 * console.log(MOCKUP_DATA.users.length); // 10
 * console.log(MOCKUP_DATA.invoices.length); // 198
 * ```
 */
export const MOCKUP_DATA = {
  users: USERS,
  suppliers: SUPPLIERS,
  consorcios: CONSORCIOS,
  projects: PROJECTS,
  materials: MATERIALS,
  purchases: PURCHASES,
  invoices: INVOICES,
} as const;

/**
 * Default export
 */
export default MOCKUP_DATA;
