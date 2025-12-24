# Mockup Data Generators

Version: 1.0 | Date: 2025-12-24 13:00

## Overview

This directory contains data generators for Contecsa's mockup data layer. All data is **deterministic** (same output every time) and **realistic** (based on Colombian construction industry).

## Generated Data Summary

| Entity | Count | Notes |
|--------|-------|-------|
| Users | 10 | 5 roles: Gerencia (2), Compras (3), Contabilidad (1), Técnico (1), Almacén (2), Inactive (1) |
| Suppliers | 27 | Colombian construction suppliers with NITs |
| Consorcios | 9 | Fixed: PAVICONSTRUJC, EDUBAR-KRA50, PTAR, HIDROCARIBE, etc. |
| Projects | ~15 | 1-2 projects per consortium with EVM metrics |
| Materials | 30 | 15 categories, 6-month price history |
| Purchases | 55 | 7-stage workflow, 15 overdue, 3 critical |
| Invoices | 198 | 66/month × 3 months, includes 3 "Caso Cartagena" |

## Files

### Core Generators

- **utils.ts** - Shared utilities (random, dates, Colombian data)
- **users.ts** - 10 users including Liced Vega (super user)
- **suppliers.ts** - 27 construction suppliers (Argos, Cemex, etc.)
- **consorcios.ts** - 9 consorcios with projects, budgets, EVM
- **materials.ts** - 30 materials with price history
- **purchases.ts** - 55 purchases with 7-stage workflow
- **invoices.ts** - 198 invoices with OCR and "Caso Cartagena"
- **index.ts** - Main export point

## Usage

### Import Pre-Generated Data

```typescript
import {
  USERS,
  SUPPLIERS,
  CONSORCIOS,
  PROJECTS,
  MATERIALS,
  PURCHASES,
  INVOICES
} from '@/lib/mockup-data/generators';

// Use directly
console.log(PURCHASES.length); // 55
console.log(INVOICES.length);  // 198
```

### Helper Functions

```typescript
import {
  getLicedVega,
  getRandomProject,
  getMaterialByCode,
  getPurchasesByState,
  getCasoCartagenaInvoices
} from '@/lib/mockup-data/generators';

// Get specific data
const liced = getLicedVega();
const project = getRandomProject();
const cement = getMaterialByCode('CEM-001');
const requisitions = getPurchasesByState('REQUISICION');
const casoCartagena = getCasoCartagenaInvoices(); // 3 invoices
```

### Validation

```typescript
import { validateMockupData } from '@/lib/mockup-data/generators';

const validation = validateMockupData();
console.log(validation.isValid); // true
console.log(validation.errors);  // []
console.log(validation.warnings); // []
```

## Key Features

### 1. Deterministic Output

All generators use a seeded random number generator (seed: 42). This ensures:
- Same data on every run
- Predictable for testing
- Reproducible demos

### 2. Realistic Colombian Data

- **NITs**: Colombian tax IDs (900123456-7)
- **Phones**: +57 3XX XXX XXXX format
- **Addresses**: Calle, Carrera, Avenida format
- **Cities**: 15 major Colombian cities
- **Names**: Common Colombian first/last names
- **Suppliers**: Real construction companies (Argos, Cemex, Holcim)

### 3. Caso Cartagena Scenario

The first 3 invoices simulate the "Caso Cartagena" scenario:
- Price deviation: +15% to +20%
- Status: `ANOMALY_DETECTED`
- Severity: `CRIT`
- Validation errors flagged
- Blocked from payment

```typescript
import { getCasoCartagenaInvoices } from '@/lib/mockup-data/generators';

const casos = getCasoCartagenaInvoices();
casos.forEach(invoice => {
  console.log(invoice.priceVariances); // Critical price anomalies
  console.log(invoice.validationResult.errors); // Error messages
});
```

### 4. Purchase Workflow Distribution

55 purchases distributed across 7 states:

| State | Count | Description |
|-------|-------|-------------|
| REQUISICION | 7 | Purchase request created |
| APROBACION | 9 | Pending approval |
| ORDEN | 12 | Order sent to supplier |
| CONFIRMACION | 8 | Supplier confirmed |
| RECEPCION | 6 | Materials received |
| CERTIFICADOS | 5 | Waiting for HSE certificates (BLOCKING) |
| CERRADO | 8 | Completed |

**At-Risk Purchases:**
- 15 purchases >30 days (red status)
- 3 purchases >45 days (critical)

### 5. Invoice Distribution

198 invoices over 3 months:
- 66 invoices per month
- OCR confidence scores (HIGH, MEDIUM, LOW)
- Validation results with errors/warnings
- Price variance detection
- 3 critical anomalies (Caso Cartagena)

### 6. Price History

Each material has 6 months of price history:
- Monthly price variations (±5%)
- Statistical metrics (mean, stdDev, volatility)
- Supplier tracking
- Used for anomaly detection in F007

## Statistics

### Purchase Stats

```typescript
import { getPurchasesStats } from '@/lib/mockup-data/generators';

const stats = getPurchasesStats();
/*
{
  total: 55,
  byState: {
    REQUISICION: 7,
    APROBACION: 9,
    ORDEN: 12,
    CONFIRMACION: 8,
    RECEPCION: 6,
    CERTIFICADOS: 5,
    CERRADO: 8
  },
  overdue: 15,
  critical: 3,
  atRisk: 12,
  byColor: {
    green: 40,
    yellow: 0,
    red: 15
  }
}
*/
```

### Invoice Stats

```typescript
import { getInvoiceStats } from '@/lib/mockup-data/generators';

const stats = getInvoiceStats();
/*
{
  total: 198,
  byStatus: {
    pending_ocr: 0,
    ocr_extracted: 0,
    pending_review: X,
    validated: Y,
    anomaly_detected: 3+,
    paid: Z,
    rejected: 0
  },
  withAnomalies: 10+,
  casoCartagena: 3,
  byMonth: {
    month1: 66,
    month2: 66,
    month3: 66
  }
}
*/
```

## Data Relationships

```
CONSORCIOS (9)
  └─> PROJECTS (15)
        ├─> PURCHASES (55)
        │     ├─> MATERIALS (30+)
        │     ├─> SUPPLIERS (27)
        │     ├─> USERS (10)
        │     └─> INVOICES (198)
        │           ├─> Price Variances
        │           ├─> OCR Data
        │           └─> Validation Results
        └─> BUDGETS + EVM
```

## Testing

All generators include TypeScript strict types and Zod validation:

```typescript
import { PurchaseSchema } from '@/lib/mockup-data/types';
import { PURCHASES } from '@/lib/mockup-data/generators';

// Validate generated data
PURCHASES.forEach(purchase => {
  const result = PurchaseSchema.safeParse(purchase);
  if (!result.success) {
    console.error('Invalid purchase:', result.error);
  }
});
```

## Customization

To regenerate data with different parameters:

```typescript
import { generatePurchases } from '@/lib/mockup-data/generators';

// Regenerate with custom distribution
const customPurchases = generatePurchases(); // Uses default distribution

// Access individual generators
import {
  generateUsers,
  generateSuppliers,
  generateMaterials
} from '@/lib/mockup-data/generators';
```

## Performance

- **Generation time**: <100ms for all data
- **Memory footprint**: ~5MB for all entities
- **Deterministic**: Same output every time
- **No external dependencies**: All data generated locally

## Next Steps

After generators are complete:
1. Create React hooks for data access
2. Build dashboard components using shadcn/ui
3. Implement filtering and search
4. Add real-time updates simulation
5. Connect to backend API (Phase 2)

## Related Documentation

- Types: `../types/README.md`
- Quick Reference: `../QUICK_REFERENCE.md`
- Project CLAUDE.md: `/CLAUDE.md`
- Feature Specs: `/docs/features/`
