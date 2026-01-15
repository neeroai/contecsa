/**
 * @file Mockup Data Test Runner
 * @description Validación rápida de que todos los generadores producen datos correctos
 * @module lib/mockup-data/generators/__test__
 * @exports N/A (test file)
 */

import {
  CONSORCIOS,
  INVOICES,
  MATERIALS,
  PROJECTS,
  PURCHASES,
  SUPPLIERS,
  USERS,
  getCasoCartagenaInvoices,
  getInvoiceStats,
  getLicedVega,
  getMockupDataSummary,
  getPurchasesStats,
  validateMockupData,
} from './index';

console.log('🧪 Testing Mockup Data Generators\n');
console.log('═'.repeat(60));

// Test 1: Data counts
console.log('\n📊 DATA SUMMARY:');
const summary = getMockupDataSummary();
console.log(summary);

// Test 2: Validation
console.log('\n✅ VALIDATION:');
const validation = validateMockupData();
console.log(`Valid: ${validation.isValid}`);
if (validation.errors.length > 0) {
  console.log('Errors:', validation.errors);
}
if (validation.warnings.length > 0) {
  console.log('Warnings:', validation.warnings);
}

// Test 3: Liced Vega exists
console.log('\n👤 LICED VEGA (Super User):');
const liced = getLicedVega();
console.log(`  Name: ${liced.firstName} ${liced.lastName}`);
console.log(`  Role: ${liced.role}`);
console.log(`  Email: ${liced.email}`);

// Test 4: Purchases stats
console.log('\n📦 PURCHASES STATS:');
const purchasesStats = getPurchasesStats();
console.log(`  Total: ${purchasesStats.total}`);
console.log(`  Overdue: ${purchasesStats.overdue}`);
console.log(`  Critical (>45d): ${purchasesStats.critical}`);
console.log(`  At Risk (30-45d): ${purchasesStats.atRisk}`);
console.log('  By State:');
Object.entries(purchasesStats.byState).forEach(([state, count]) => {
  console.log(`    ${state}: ${count}`);
});

// Test 5: Invoice stats
console.log('\n📄 INVOICE STATS:');
const invoiceStats = getInvoiceStats();
console.log(`  Total: ${invoiceStats.total}`);
console.log(`  With Anomalies: ${invoiceStats.withAnomalies}`);
console.log(`  Caso Cartagena: ${invoiceStats.casoCartagena}`);
console.log('  By Status:');
Object.entries(invoiceStats.byStatus).forEach(([status, count]) => {
  console.log(`    ${status}: ${count}`);
});

// Test 6: Caso Cartagena invoices
console.log('\n🚨 CASO CARTAGENA INVOICES:');
const casoCartagena = getCasoCartagenaInvoices();
console.log(`  Count: ${casoCartagena.length}`);
casoCartagena.forEach((inv, i) => {
  console.log(`\n  Invoice ${i + 1}:`);
  console.log(`    Number: ${inv.invoiceNumber}`);
  console.log(`    Status: ${inv.status}`);
  console.log(`    Severity: ${inv.anomalySeverity}`);
  console.log(`    Price Variances: ${inv.priceVariances.length}`);
  inv.priceVariances.forEach((variance) => {
    console.log(
      `      - ${variance.materialName}: +${variance.priceChange.toFixed(1)}% ($${variance.variance.toLocaleString('es-CO')})`,
    );
  });
});

// Test 7: Sample data
console.log('\n📋 SAMPLE DATA:');
console.log(`  First User: ${USERS[0].firstName} ${USERS[0].lastName} (${USERS[0].role})`);
console.log(`  First Supplier: ${SUPPLIERS[0].name}`);
console.log(`  First Consortium: ${CONSORCIOS[0].name} (${CONSORCIOS[0].code})`);
console.log(`  First Project: ${PROJECTS[0].name}`);
console.log(`  First Material: ${MATERIALS[0].name} (${MATERIALS[0].code})`);
console.log(`  First Purchase: ${PURCHASES[0].poNumber} - ${PURCHASES[0].state}`);
console.log(`  First Invoice: ${INVOICES[0].invoiceNumber} - ${INVOICES[0].status}`);

console.log('\n' + '═'.repeat(60));
console.log('✨ All tests completed!\n');

// Exit with status code based on validation
process.exit(validation.isValid ? 0 : 1);
