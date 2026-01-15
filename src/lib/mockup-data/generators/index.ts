/**
 * @file Mockup Data Generators - Main Export
 * @description Punto central de exportación para todos los generadores de datos de mockup
 * @module lib/mockup-data/generators
 * @exports generateUsers, generateSuppliers, generateConsorcios, generateProjects, generateMaterials, generatePurchases, generateInvoices, USERS, SUPPLIERS, CONSORCIOS, PROJECTS, MATERIALS, PURCHASES, INVOICES, getMockupDataSummary, validateMockupData, MOCKUP_DATA, and all generator functions
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

// ============================================================================
// SUMMARY, VALIDATION & AGGREGATED DATA
// ============================================================================
// Moved to separate file to avoid circular imports
export * from './stats';
