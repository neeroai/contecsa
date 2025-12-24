# Quick Reference - Mockup Data Types

## Import Everything

```typescript
import type {
  User,
  Purchase,
  Invoice,
  Material,
  Project,
  Inventory,
  Certificate,
  Notification,
} from '@/lib/mockup-data/types';

import {
  UserSchema,
  PurchaseSchema,
  InvoiceSchema,
  MaterialSchema,
  ProjectSchema,
  InventorySchema,
  CertificateSchema,
  NotificationSchema,
  // Enums
  RoleEnum,
  PurchaseStateEnum,
  MaterialCategoryEnum,
  // Metadata
  ROLE_METADATA,
  PURCHASE_STATE_METADATA,
  MATERIAL_CATEGORY_METADATA,
  // State machine
  STATE_TRANSITIONS,
} from '@/lib/mockup-data/types';
```

## Essential Types

### User & Authentication
```typescript
// 5 roles
type Role = 'gerencia' | 'compras' | 'contabilidad' | 'tecnico' | 'almacen';

interface User {
  readonly id: string;
  readonly email: string;
  readonly role: Role;
  readonly isActive: boolean;
}

interface UserPreferences {
  readonly language: 'es' | 'en';
  readonly theme: 'light' | 'dark';
}
```

### Purchase (7-Stage Workflow)
```typescript
// States: REQUISICION → APROBACION → ORDEN → CONFIRMACION → RECEPCION → CERTIFICADOS → CERRADO
type PurchaseState = 'REQUISICION' | 'APROBACION' | 'ORDEN' | 'CONFIRMACION' | 'RECEPCION' | 'CERTIFICADOS' | 'CERRADO';

interface Purchase {
  readonly id: string;
  readonly poNumber: string;
  readonly state: PurchaseState;
  readonly statusColor: 'green' | 'yellow' | 'red';
  readonly daysInProcess: number;
  readonly materials: readonly PurchaseMaterial[];
  readonly budgetedAmount: number;
  readonly orderedAmount: number;
}

// State transitions
const validNextStates = STATE_TRANSITIONS[currentState];
```

### Invoice (OCR & Price Variance)
```typescript
// OCR Confidence
type OCRConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

interface Invoice {
  readonly id: string;
  readonly purchaseId: string;
  readonly extractedFields: ExtractedFields; // 15 OCR fields
  readonly priceVariances: readonly PriceVariance[];
  readonly hasAnomalies: boolean;
  readonly anomalySeverity?: 'MED' | 'HIGH' | 'CRIT'; // >15% is CRITICAL
}

interface PriceVariance {
  readonly anomalySeverity: 'MED' | 'HIGH' | 'CRIT';
  readonly priceChange: number; // percentage
  readonly detectedAt: Date;
}
```

### Material (15 Categories)
```typescript
type MaterialCategory =
  | 'CEMENTO' | 'ACERO' | 'MADERA' | 'HORMIGON' | 'ARENA'
  | 'GRAVA' | 'LADRILLOS' | 'TUBERIAS' | 'ELECTRICIDAD' | 'EQUIPOS'
  | 'HERRAMIENTAS' | 'COMBUSTIBLE' | 'SERVICIOS' | 'LABORATORIO' | 'OTROS';

interface Material {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly category: MaterialCategory;
  readonly currentPrice: number;
  readonly priceHistory: readonly PriceHistoryEntry[];
  readonly minStock: number;
  readonly maxStock: number;
}
```

### Project (EVM Metrics)
```typescript
interface Project {
  readonly id: string;
  readonly consortiumId: string;
  readonly consortiumName: string;
  readonly budget: Budget;
  readonly evmMetrics: EVMMetrics;
  readonly completionPercentage: number;
}

interface EVMMetrics {
  readonly plannedValue: number;     // PV
  readonly earnedValue: number;      // EV
  readonly actualCost: number;       // AC
  readonly cpi: number;              // CPI = EV/AC (Cost Performance Index)
  readonly spi: number;              // SPI = EV/PV (Schedule Performance Index)
  readonly eac: number;              // Estimate at Completion
  readonly etc: number;              // Estimate to Complete
}
```

### Inventory
```typescript
interface Inventory {
  readonly id: string;
  readonly materialId: string;
  readonly currentStock: number;
  readonly status: 'OPTIMAL' | 'LOW' | 'CRITICAL' | 'OVERSTOCKED';
  readonly consumptionForecast: ConsumptionForecast;
  readonly stockLevels: readonly StockLevel[]; // by warehouse
}

interface ConsumptionForecast {
  readonly averageDailyConsumption: number;
  readonly forecastedDaysOfStock: number;
  readonly projectedStockOut?: Date;
}
```

### Certificate (HSE Compliance - BLOCKING GATE)
```typescript
type CertificateType = 'CALIDAD' | 'SEGURIDAD' | 'AMBIENTAL' | 'FACTURA';

interface Certificate {
  readonly id: string;
  readonly certificateType: CertificateType;
  readonly purchaseId: string;
  readonly status: 'PENDING' | 'RECEIVED' | 'VERIFIED' | 'VALID' | 'EXPIRED' | 'REJECTED' | 'MISSING';
  readonly isBlocker: boolean; // CALIDAD & SEGURIDAD block purchase closure
  readonly expiryDate: Date;
  readonly daysUntilExpiry: number;
  readonly isExpired: boolean;
}

// CRITICAL: Can't close purchase (Stage 6 → 7) without valid CALIDAD/SEGURIDAD
if (certificate.status !== 'VALID' && certificate.isBlocker) {
  // Block purchase closure
}
```

### Notification
```typescript
type NotificationType =
  | 'PURCHASE_CREATED' | 'PURCHASE_OVERDUE'
  | 'INVOICE_ANOMALY' | 'PRICE_VARIANCE_DETECTED'
  | 'CERTIFICATE_MISSING' | 'CERTIFICATE_EXPIRING'
  | 'STOCK_LOW' | 'STOCK_CRITICAL'
  | 'BUDGET_VARIANCE' | 'MAINTENANCE_DUE';

interface Notification {
  readonly id: string;
  readonly notificationType: NotificationType;
  readonly priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly channels: Array<'EMAIL' | 'IN_APP' | 'SMS' | 'PUSH' | 'WEBHOOK'>;
  readonly deliveryAttempts: readonly DeliveryAttempt[];
  readonly primaryDeliveryStatus: 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
}
```

## Validation

### Parse and Validate
```typescript
const result = PurchaseSchema.safeParse(rawData);

if (result.success) {
  const purchase: Purchase = result.data;
  console.log('Valid purchase:', purchase.poNumber);
} else {
  const errors = result.error.flatten();
  console.error('Validation errors:', errors);
}
```

### Type Inference
```typescript
import type { z } from 'zod';

type ValidatedPurchase = z.infer<typeof PurchaseSchema>;
// Equivalent to: type ValidatedPurchase = Purchase
```

## Enums & Metadata

### Access Enum Values
```typescript
// Get all role keys
Object.values(RoleEnum);
// ['gerencia', 'compras', 'contabilidad', 'tecnico', 'almacen']

// Get enum value
const managerRole = RoleEnum.GERENCIA; // 'gerencia'
```

### Get UI Metadata
```typescript
const roleInfo = ROLE_METADATA['gerencia'];
// { label: 'Gerencia', color: 'blue', ... }

const stateInfo = PURCHASE_STATE_METADATA['CERTIFICADOS'];
// { label: 'Certificados', isBlocking: true, ... }

const categoryInfo = MATERIAL_CATEGORY_METADATA['ACERO'];
// { label: 'Acero', icon: 'Box', defaultUnit: 'kg' }
```

## State Machine

### Check Valid Transitions
```typescript
const currentState: PurchaseState = 'REQUISICION';
const validNextStates = STATE_TRANSITIONS[currentState];
// ['APROBACION']

// Validate transition
if (validNextStates.includes(newState)) {
  // Perform state change
} else {
  // Invalid transition
}
```

## Common Patterns

### Create User
```typescript
import { UserSchema } from '@/lib/mockup-data/types';

const newUser = UserSchema.parse({
  id: crypto.randomUUID(),
  email: 'user@contecsa.com',
  firstName: 'Juan',
  lastName: 'Pérez',
  role: 'compras',
  department: 'Procurement',
  organization: 'Contecsa',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

### Create Purchase
```typescript
import { PurchaseSchema } from '@/lib/mockup-data/types';
import { PurchaseStateEnum } from '@/lib/mockup-data/types';

const newPurchase = PurchaseSchema.parse({
  id: crypto.randomUUID(),
  poNumber: 'PO-2025-001',
  state: PurchaseStateEnum.REQUISICION,
  statusColor: 'green',
  // ... other required fields
});
```

### Filter Materials by Category
```typescript
import { MaterialCategoryEnum } from '@/lib/mockup-data/types';

const steelMaterials = materials.filter(
  (m) => m.category === MaterialCategoryEnum.ACERO
);
```

### Check Certificate Status
```typescript
import { CertificateTypeEnum } from '@/lib/mockup-data/types';

const isQualityCertValid = certificate.certificateType === CertificateTypeEnum.CALIDAD
  && certificate.status === 'VALID'
  && !certificate.isExpired;

// Critical for purchase closure
if (!isQualityCertValid) {
  // Prevent moving from CERTIFICADOS → CERRADO
}
```

## File Sizes

| Type File | Lines |
|-----------|-------|
| user.ts | 180 |
| purchase.ts | 400 |
| invoice.ts | 459 |
| material.ts | 411 |
| project.ts | 402 |
| inventory.ts | 423 |
| certificate.ts | 407 |
| notification.ts | 412 |
| **Total** | **3,094** |

## TypeScript Strict Mode

All types compiled with:
- ✓ `strict: true`
- ✓ `noUnusedLocals: true`
- ✓ `noUnusedParameters: true`
- ✓ `noFallthroughCasesInSwitch: true`
- ✓ Zero `any` types

## Documentation

For full details, see:
- `/src/lib/mockup-data/README.md` - Comprehensive guide
- Individual type files - JSDoc comments
- `/TYPES_IMPLEMENTATION_SUMMARY.md` - Implementation overview

---

Last Updated: 2025-12-24 12:00
