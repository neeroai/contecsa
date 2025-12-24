/**
 * Mockup Data Generators - Main Export
 * Contecsa Sistema de Inteligencia de Datos
 *
 * Version: 1.0 | Date: 2025-12-24 13:00
 *
 * Central export point for all mockup data generators.
 * Provides pre-generated data and generator functions.
 */

// ============================================================================
// UTILITIES
// ============================================================================
export * from './utils';

// ============================================================================
// USERS (10 users across 5 roles)
// ============================================================================
export {
  USERS,
  generateUsers,
  getUsersByRole,
  getUserByName,
  getLicedVega,
  getRandomUserByRole,
} from './users';

// ============================================================================
// SUPPLIERS (20+ Colombian construction suppliers)
// ============================================================================
export {
  SUPPLIERS,
  generateSuppliers,
  getSupplierByName,
  getSuppliersByCategory,
  getRandomSupplier,
  getRandomSupplierByCategory,
} from './suppliers';

export type { Supplier } from './suppliers';

// ============================================================================
// CONSORCIOS (9 fixed consorcios + projects)
// ============================================================================
export {
  CONSORCIOS,
  PROJECTS,
  generateConsorcios,
  generateProjects,
  getConsortiumByCode,
  getProjectsByConsortium,
  getRandomProject,
} from './consorcios';

// ============================================================================
// MATERIALS (30+ materials across 15 categories)
// ============================================================================
export {
  MATERIALS,
  generateMaterials,
  getMaterialByCode,
  getMaterialsByCategory,
  getRandomMaterial,
  getRandomMaterialByCategory,
} from './materials';

// ============================================================================
// PURCHASES (55 purchases with 7-stage workflow)
// ============================================================================
export {
  PURCHASES,
  generatePurchases,
  getPurchasesByState,
  getOverduePurchases,
  getPurchasesByProject,
  getPurchasesByColor,
  getPurchasesStats,
} from './purchases';

// ============================================================================
// INVOICES (198 invoices with Caso Cartagena)
// ============================================================================
export {
  INVOICES,
  generateInvoices,
  getCasoCartagenaInvoices,
  getInvoicesByStatus,
  getInvoicesWithAnomalies,
  getInvoicesByPurchase,
  getInvoiceStats,
} from './invoices';

import { CONSORCIOS, PROJECTS } from './consorcios';
import { INVOICES } from './invoices';
import { MATERIALS } from './materials';
import { PURCHASES } from './purchases';
import { SUPPLIERS } from './suppliers';
// Re-import for local use
import { USERS } from './users';

// ============================================================================
// SUMMARY STATS
// ============================================================================

/**
 * Get complete mockup data summary
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
 * Validate all generated data
 * Returns true if all data is consistent
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
 * Export all data as a single object
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
