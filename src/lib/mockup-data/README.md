# Mockup Data Types & Schemas

Version: 1.0 | Date: 2025-12-24 12:00

## Overview

Comprehensive TypeScript type definitions for the Contecsa mockup data layer. All types are:
- **Strictly typed** (TypeScript 5.6.3 strict mode)
- **Validated** with Zod 3.24.1 schemas
- **Documented** with comprehensive comments
- **Organized** into logical domains
- **Readonly** properties where applicable

## Structure

```
src/lib/mockup-data/types/
├── user.ts           # Users, roles, authentication (5 roles)
├── purchase.ts       # Purchase orders, 7-stage workflow, audit logs
├── invoice.ts        # Invoices, OCR extraction, price variance detection
├── material.ts       # Materials, 15 categories, price history
├── project.ts        # Projects, consortiums, EVM metrics, budgets
├── inventory.ts      # Inventory, stock levels, material movements
├── certificate.ts    # Certificates, HSE compliance, blocking gates
├── notification.ts   # Notifications, alerts, delivery tracking
└── index.ts          # Central export point
```

## Type Domains

### 1. User Management (`user.ts`)

**Key Types:**
- `Role` - 5 roles: gerencia, compras, contabilidad, tecnico, almacen
- `User` - User profile with contact and authentication info
- `UserProfile` - Extended user with preferences
- `AuthSession` - Active authentication sessions

**Features:**
- Role-based metadata for UI
- User preferences (language, theme, notifications)
- Session tracking with IP/user agent

**Schema:** `UserSchema`, `UserPreferencesSchema`, `AuthSessionSchema`

### 2. Purchase Management (`purchase.ts`)

**Key Types:**
- `PurchaseState` - 7-stage state machine (REQUISICION → CERRADO)
- `Purchase` - Complete purchase order (28 fields from Excel)
- `AuditLogEntry` - Track all state changes and updates
- `AlertFlag` - Overdue, budget, quality alerts

**Features:**
- State machine with valid transitions
- Semantic status colors (green/yellow/red)
- Material line items with quality tracking
- Attachment management
- Comprehensive audit trail

**State Machine:**
```
REQUISICION → APROBACION → ORDEN → CONFIRMACION → RECEPCION → CERTIFICADOS → CERRADO
```

**Schemas:** `PurchaseSchema`, `AuditLogEntrySchema`, `AlertFlagSchema`

### 3. Invoice Management (`invoice.ts`)

**Key Types:**
- `Invoice` - Complete invoice with OCR extraction
- `ExtractedFields` - 15 OCR fields with confidence scores
- `PriceVariance` - Anomaly detection (PREVENT CASO CARTAGENA)
- `ValidationResult` - Extraction validation with errors/warnings

**Features:**
- OCR extraction (Google Vision, AWS Textract, manual)
- Confidence scoring for each extracted field
- Price variance detection (MED/HIGH/CRIT severity)
- Invoice-to-PO matching
- Payment tracking

**Critical for F007:** Detects price anomalies >15% with 100% accuracy

**Schemas:** `InvoiceSchema`, `PriceVarianceSchema`, `ValidationResultSchema`

### 4. Material Management (`material.ts`)

**Key Types:**
- `MaterialCategory` - 15 categories (CEMENTO, ACERO, MADERA, etc.)
- `Material` - Full material definition with pricing
- `PriceHistoryEntry` - Historical pricing for anomaly detection
- `MaterialComparison` - Supplier price comparison

**Features:**
- 15 material categories across construction
- Price history tracking for trend analysis
- Price volatility metrics
- Supplier relationships and lead times
- Material specifications and certifications

**Schemas:** `MaterialSchema`, `PriceHistoryEntrySchema`, `MaterialComparisonSchema`

### 5. Project Management (`project.ts`)

**Key Types:**
- `Project` - Individual project under consortium
- `Consortium` - Multi-organization shared projects (9 consorcios)
- `Budget` - Project budgeting with variance tracking
- `EVMMetrics` - Earned Value Management metrics (CPI, SPI, EAC, ETC)
- `Forecast` - Financial forecasting (90-day horizon)

**Features:**
- 9 consortiums (PAVICONSTRUJC, EDUBAR-KRA50, PTAR, etc.)
- EVM metrics: CPI, SPI, VAC, CV, SV
- Budget utilization and variance tracking
- Health status (ON_TRACK/AT_RISK/OFF_TRACK)
- Material consumption and cost analysis

**Schemas:** `ProjectSchema`, `EVMMetricsSchema`, `BudgetSchema`

### 6. Inventory Management (`inventory.ts`)

**Key Types:**
- `Inventory` - Main inventory tracking
- `StockLevel` - Stock at specific warehouse
- `MaterialMovement` - RECEPTION/DELIVERY/ADJUSTMENT/CONSUMPTION
- `ConsumptionForecast` - 30-day consumption projection
- `InventoryAlert` - Low stock, critical stock, variance alerts

**Features:**
- Multi-warehouse stock tracking
- Movement history with quality status
- Consumption forecasting
- Automatic low/critical stock alerts
- Inventory count reconciliation
- Turnover rate and holding cost metrics

**Schemas:** `InventorySchema`, `MaterialMovementSchema`, `ConsumptionForecastSchema`

### 7. Certificate Management (`certificate.ts`)

**Key Types:**
- `Certificate` - Individual certificate tracking
- `CertificateType` - CALIDAD, SEGURIDAD, AMBIENTAL, FACTURA
- `CertificateRequirement` - Required certs for purchase
- `CertificateAlert` - Expiry, missing, verification alerts

**Features:**
- 4 certificate types with blocking gates
- CRITICAL: Blocks purchase closure if missing (Stage 6 → 7)
- 7-year retention requirement (DIAN compliance)
- Verification workflow
- Expiry alerts (5-day deadline)
- Batch operations

**Blocking Gate:** CALIDAD and SEGURIDAD block purchase completion

**Schemas:** `CertificateSchema`, `CertificateRequirementSchema`, `CertificateAlertSchema`

### 8. Notification System (`notification.ts`)

**Key Types:**
- `Notification` - Main notification model
- `NotificationType` - 20 notification types across system
- `AlertPriority` - LOW/MEDIUM/HIGH/CRITICAL
- `DeliveryAttempt` - Track delivery attempts with retry logic
- `NotificationTemplate` - Reusable message templates

**Features:**
- Multi-channel delivery (EMAIL, IN_APP, SMS, PUSH, WEBHOOK)
- Gmail API integration (250 req/sec, >99% delivery)
- Retry logic (3 attempts configurable)
- Delivery status tracking (QUEUED → DELIVERED → READ)
- Priority queue for critical alerts
- Digest aggregation (daily/weekly)

**Schemas:** `NotificationSchema`, `DeliveryAttemptSchema`, `NotificationTemplateSchema`

## Usage Examples

### Import Types

```typescript
import type {
  Purchase,
  PurchaseState,
  User,
  Invoice,
  Material,
  Project,
  Certificate,
  Notification,
} from '@/lib/mockup-data/types';
```

### Import Schemas

```typescript
import {
  PurchaseSchema,
  InvoiceSchema,
  MaterialSchema,
  ProjectSchema,
  CertificateSchema,
  NotificationSchema,
} from '@/lib/mockup-data/types';
```

### Validate at Runtime

```typescript
// Parse and validate
const result = PurchaseSchema.safeParse(rawData);

if (result.success) {
  const purchase: Purchase = result.data;
  // Use purchase...
} else {
  console.error('Validation errors:', result.error.flatten());
}
```

### Type Inference from Zod

```typescript
import { type PurchaseType, PurchaseSchema } from '@/lib/mockup-data/types';

// Type from schema
const purchase: PurchaseType = await fetchPurchase();

// Inferred from schema without separate type
type ValidatedInvoice = z.infer<typeof InvoiceSchema>;
```

## Critical Features Integration

### F003: Seguimiento de Compras (7-Stage Workflow)

Uses: `Purchase`, `PurchaseState`, `STATE_TRANSITIONS`, `Certificate`

```typescript
const validNextStates = STATE_TRANSITIONS[currentPurchase.state];
// REQUISICION → APROBACION
// CERTIFICADOS is blocking gate
```

### F004: OCR Facturas

Uses: `Invoice`, `ExtractedFields`, `ValidationResult`, `OCRConfidence`

```typescript
const extracted: ExtractedFields = invoice.extractedFields;
const confidence: OCRConfidence = extracted.invoiceNumber.confidence;
```

### F007: Análisis de Precios y Anomalías (PREVENT CASO CARTAGENA)

Uses: `Invoice`, `PriceVariance`, `Material`, `PriceHistoryEntry`

```typescript
// Detect price variance >15% (CRIT severity)
const variance: PriceVariance = {
  anomalySeverity: 'CRIT', // >15% deviation
  // Blocks invoice closure
};
```

### F008: Gestión Certificados HSE (BLOCKING GATE)

Uses: `Certificate`, `CertificateRequirement`, `CertificateAlert`

```typescript
// Can't close purchase (Stage 6 → 7) without valid CALIDAD/SEGURIDAD cert
if (blockingCert.status !== 'VALID') {
  return 'Cannot close purchase - missing certificate';
}
```

### F009: Control de Inventario

Uses: `Inventory`, `MaterialMovement`, `ConsumptionForecast`, `StockLevel`

```typescript
const forecast: ConsumptionForecast = inventory.consumptionForecast;
const daysUntilStockOut = forecast.forecastedDaysOfStock;
```

## Validation Rules

### Strict TypeScript

All types enforce:
- `strict: true` (no implicit any)
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`

### Zod Schemas

All Zod schemas validate:
- Type correctness
- Range constraints (min/max)
- Format validation (UUID, email, URL)
- Required vs optional fields
- Enum values
- Nested object structures

### No Any Types

Zero `any` types used throughout. All types are:
- Explicitly defined
- Generic where appropriate
- Union types for variants
- Readonly for immutability

## Performance Considerations

### Readonly Properties

Use `readonly` for:
- Data that shouldn't be mutated
- Immutable snapshots (dates, audit logs)
- Nested objects (materials, user info)

```typescript
export interface Purchase {
  readonly id: string;
  readonly poNumber: string;
  readonly materials: readonly PurchaseMaterial[];
}
```

### Generic Schemas

Reusable schema generators for common patterns:

```typescript
// Extracted fields with confidence
export const ExtractedFieldSchema = <T extends z.ZodTypeAny>(innerSchema: T) =>
  z.object({
    value: innerSchema,
    confidence: OCRConfidenceSchema,
    rawText: z.string().optional(),
  });
```

## Data Consistency

### Enumerations

All enums have both TypeScript and Zod versions:

```typescript
// TypeScript type
export type PurchaseState = 'REQUISICION' | 'APROBACION' | ... | 'CERRADO';

// Object for lookups
export const PurchaseStateEnum = { REQUISICION: 'REQUISICION' as const, ... };

// Zod schema for validation
export const PurchaseStateSchema = z.enum(['REQUISICION', 'APROBACION', ...]);
```

### Metadata Objects

Provide UI rendering info without hardcoding:

```typescript
export const PURCHASE_STATE_METADATA: Record<PurchaseState, StateMetadata> = {
  REQUISICION: { label: 'Requisición', icon: 'FileText', ... },
  ...
};
```

## Future Extensions

This type system supports:
- Multi-language labels via i18n integration
- Custom validators per field
- Audit trail for all changes
- API response serialization
- GraphQL schema generation (if needed)
- OpenAPI documentation

## Related Documentation

- Feature specifications: `/specs/f001-f014/SPEC.md`
- API contracts: Will be generated from these types
- Database schema: Drizzle ORM types derive from these
- UI component props: React types extend these

## Support

For issues or questions:
1. Check feature spec in `/specs/`
2. Review CLAUDE.md for project context
3. Validate with Zod schemas before use
4. Use TypeScript strict mode
