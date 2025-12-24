/**
 * Quick verification that generators can be imported and executed
 */

// Import all generators
import {
  CONSORCIOS,
  INVOICES,
  MATERIALS,
  PROJECTS,
  PURCHASES,
  SUPPLIERS,
  USERS,
  validateMockupData,
} from './index';

// Verify all data exists
console.log('✅ All generators imported successfully');
console.log(`  Users: ${USERS.length}`);
console.log(`  Suppliers: ${SUPPLIERS.length}`);
console.log(`  Consorcios: ${CONSORCIOS.length}`);
console.log(`  Projects: ${PROJECTS.length}`);
console.log(`  Materials: ${MATERIALS.length}`);
console.log(`  Purchases: ${PURCHASES.length}`);
console.log(`  Invoices: ${INVOICES.length}`);

// Run validation
const validation = validateMockupData();
console.log(`\n✅ Validation: ${validation.isValid ? 'PASSED' : 'FAILED'}`);

if (!validation.isValid) {
  console.error('Errors:', validation.errors);
  process.exit(1);
}

console.log('\n🎉 All generators working correctly!');
