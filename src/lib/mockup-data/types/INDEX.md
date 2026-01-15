# types - Index

Version: 1.1 | Date: 2026-01-15

> Auto-generated from codebase structure

## Purpose

TypeScript type definitions shared across the application.
## File Map

| File | Purpose | Key Exports |
|------|---------|-------------|
| certificate.ts | Certificate and HSE Compliance Types | CertificateType, CertificateTypeEnum, CertificateTypeMetadata, CERTIFICATE_TYPE_METADATA, CertificateStatus |
| index.ts | Central Export for All Mockup Data Types | (none) |
| inventory.ts | Inventory and Stock Management Types | MovementType, MovementTypeEnum, WarehouseLocation, StockLevel, MaterialMovement |
| invoice.ts | Invoice and OCR Types | OCRConfidence, OCRConfidenceEnum, InvoiceStatus, InvoiceStatusEnum, ExtractedFields |
| material.ts | Material and Category Types | MaterialCategory, MaterialCategoryEnum, CategoryMetadata, MATERIAL_CATEGORY_METADATA, MaterialStatus |
| notification.ts | Notification and Alert Types | NotificationType, NotificationTypeEnum, AlertPriority, AlertPriorityEnum, AlertType |
| project.ts | Project and Consortium Types | ProjectStatus, ProjectStatusEnum, EVMMetrics, BudgetLine, Budget |
| purchase.ts | Purchase and State Management Types | PurchaseState, PurchaseStateEnum, StateMetadata, PURCHASE_STATE_METADATA, StatusColor |
| user.ts | User and Role Types | Role, RoleEnum, RoleMetadata, ROLE_METADATA, User |

## Quick Start

```typescript
// Import from types
import { CertificateType } from '@/.../types/certificate';
```

---
**Generated:** 2026-01-15T10:14:13.786Z
**Files:** 9 | **Subdirs:** 0
