/**
 * Central Export for All Mockup Data Types
 * Contecsa Sistema de Inteligencia de Datos
 *
 * Version: 1.0 | Date: 2025-12-24 12:00
 *
 * This module aggregates and re-exports all type definitions and Zod schemas
 * for the mockup data layer. Provides clean, organized imports for the application.
 *
 * Usage:
 *   import type { Purchase, User, Invoice } from '@/lib/mockup-data/types'
 *   import { PurchaseSchema, UserSchema } from '@/lib/mockup-data/types'
 */

// ============================================================================
// USER TYPES & SCHEMAS
// ============================================================================
export type {
  Role,
  User,
  UserProfile,
  UserPreferences,
  AuthSession,
  RoleMetadata,
} from './user';

export {
  RoleEnum,
  ROLE_METADATA,
  RoleSchema,
  UserPreferencesSchema,
  UserSchema,
  UserProfileSchema,
  AuthSessionSchema,
  // Type inference exports
  type UserPreferencesType,
  type UserType,
  type UserProfileType,
  type AuthSessionType,
} from './user';

// ============================================================================
// PURCHASE TYPES & SCHEMAS
// ============================================================================
export type {
  PurchaseState,
  StatusColor,
  AuditLogEntry,
  Purchase,
  PurchaseMaterial,
  Attachment,
  PurchaseNote,
  AlertFlag,
  StateMetadata,
} from './purchase';

export {
  PurchaseStateEnum,
  PURCHASE_STATE_METADATA,
  STATE_TRANSITIONS,
  PurchaseStateSchema,
  StatusColorSchema,
  AuditLogEntrySchema,
  PurchaseMaterialSchema,
  AttachmentSchema,
  PurchaseNoteSchema,
  AlertFlagSchema,
  PurchaseSchema,
  // Type inference exports
  type PurchaseType,
  type PurchaseMaterialType,
  type AttachmentType,
  type PurchaseNoteType,
  type AlertFlagType,
  type AuditLogEntryType,
} from './purchase';

// ============================================================================
// INVOICE TYPES & SCHEMAS
// ============================================================================
export type {
  OCRConfidence,
  InvoiceStatus,
  ExtractedFields,
  ExtractedField,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  PriceVariance,
  Invoice,
  InvoiceLineMatch,
  InvoiceAttachment,
  InvoiceAuditEntry,
} from './invoice';

export {
  OCRConfidenceEnum,
  InvoiceStatusEnum,
  OCRConfidenceSchema,
  InvoiceStatusSchema,
  ExtractedFieldsSchema,
  ValidationErrorSchema,
  ValidationWarningSchema,
  ValidationResultSchema,
  PriceVarianceSchema,
  InvoiceLineMatchSchema,
  InvoiceAttachmentSchema,
  InvoiceAuditEntrySchema,
  InvoiceSchema,
  // Type inference exports
  type InvoiceType,
  type ExtractedFieldsType,
  type ValidationResultType,
  type PriceVarianceType,
  type InvoiceLineMatchType,
  type InvoiceAttachmentType,
  type InvoiceAuditEntryType,
} from './invoice';

// ============================================================================
// MATERIAL TYPES & SCHEMAS
// ============================================================================
export type {
  MaterialCategory,
  MaterialStatus,
  PriceHistoryEntry,
  Material,
  MaterialFilter,
  MaterialComparison,
  SupplierPricingInfo,
  CategoryMetadata,
} from './material';

export {
  MaterialCategoryEnum,
  MaterialStatusEnum,
  MATERIAL_CATEGORY_METADATA,
  MaterialCategorySchema,
  MaterialStatusSchema,
  PriceHistoryEntrySchema,
  MaterialSchema,
  MaterialFilterSchema,
  SupplierPricingInfoSchema,
  MaterialComparisonSchema,
  // Type inference exports
  type MaterialType,
  type PriceHistoryEntryType,
  type MaterialFilterType,
  type SupplierPricingInfoType,
  type MaterialComparisonType,
} from './material';

// ============================================================================
// PROJECT TYPES & SCHEMAS
// ============================================================================
export type {
  ProjectStatus,
  EVMMetrics,
  BudgetLine,
  Budget,
  Forecast,
  Consortium,
  ConsortiumMember,
  Project,
  ProjectMonthlySummary,
  ProjectFilter,
} from './project';

export {
  ProjectStatusEnum,
  ProjectStatusSchema,
  BudgetLineSchema,
  BudgetSchema,
  EVMMetricsSchema,
  ForecastSchema,
  ConsortiumMemberSchema,
  ConsortiumSchema,
  ProjectSchema,
  ProjectMonthlySummarySchema,
  ProjectFilterSchema,
  // Type inference exports
  type ProjectType,
  type BudgetType,
  type BudgetLineType,
  type EVMMetricsType,
  type ForecastType,
  type ConsortiumType,
  type ConsortiumMemberType,
  type ProjectMonthlySummaryType,
  type ProjectFilterType,
} from './project';

// ============================================================================
// INVENTORY TYPES & SCHEMAS
// ============================================================================
export type {
  MovementType,
  WarehouseLocation,
  StockLevel,
  MaterialMovement,
  InventoryCount,
  InventoryCountLine,
  ConsumptionForecast,
  Inventory,
  InventoryAlert,
  InventorySummary,
} from './inventory';

export {
  MovementTypeEnum,
  MovementTypeSchema,
  WarehouseLocationSchema,
  StockLevelSchema,
  MaterialMovementSchema,
  InventoryCountLineSchema,
  InventoryCountSchema,
  ConsumptionForecastSchema,
  InventoryAlertSchema,
  InventorySchema,
  InventorySummarySchema,
  // Type inference exports
  type InventoryType,
  type StockLevelType,
  type MaterialMovementType,
  type InventoryCountType,
  type InventoryCountLineType,
  type ConsumptionForecastType,
  type InventoryAlertType,
  type InventorySummaryType,
  type WarehouseLocationType,
} from './inventory';

// ============================================================================
// CERTIFICATE TYPES & SCHEMAS
// ============================================================================
export type {
  CertificateType,
  CertificateStatus,
  CertificateVerification,
  Certificate,
  CertificateRequirement,
  CertificateAlert,
  CertificateReport,
  CertificateBlockerStatus,
  CertificateBatchUpdate,
  CertificateTypeMetadata,
} from './certificate';

export {
  CertificateTypeEnum,
  CertificateStatusEnum,
  CERTIFICATE_TYPE_METADATA,
  CertificateTypeSchema,
  CertificateStatusSchema,
  CertificateVerificationSchema,
  CertificateSchema,
  CertificateRequirementSchema,
  CertificateAlertSchema,
  CertificateBlockerStatusSchema,
  CertificateReportSchema,
  // Type inference exports
  type CertificateType_Inferred,
  type CertificateVerificationType,
  type CertificateRequirementType,
  type CertificateAlertType,
  type CertificateBlockerStatusType,
  type CertificateReportType,
} from './certificate';

// ============================================================================
// NOTIFICATION TYPES & SCHEMAS
// ============================================================================
export type {
  NotificationType,
  AlertPriority,
  AlertType,
  NotificationChannel,
  DeliveryStatus,
  NotificationMetadata,
  DeliveryAttempt,
  NotificationRule,
  NotificationTarget,
  Notification,
  NotificationTemplate,
  NotificationDigest,
  NotificationStats,
} from './notification';

export {
  NotificationTypeEnum,
  AlertPriorityEnum,
  AlertTypeEnum,
  NotificationChannelEnum,
  DeliveryStatusEnum,
  NotificationTypeSchema,
  AlertPrioritySchema,
  AlertTypeSchema,
  NotificationChannelSchema,
  DeliveryStatusSchema,
  NotificationMetadataSchema,
  DeliveryAttemptSchema,
  NotificationTargetSchema,
  NotificationSchema,
  // Type inference exports
  type NotificationType_Inferred,
  type DeliveryAttemptType,
  type NotificationMetadataType,
  type NotificationTargetType,
} from './notification';

// ============================================================================
// FEATURE SUMMARY
// ============================================================================

/**
 * Complete type system for Contecsa 14 features:
 *
 * F001 - Agente IA Conversacional
 *   Uses: Notification, User, Project types
 *
 * F002 - Dashboard Ejecutivo
 *   Uses: User, Project, Purchase, Invoice, Inventory, Budget, EVMMetrics types
 *
 * F003 - Seguimiento de Compras (7-stage workflow)
 *   Uses: Purchase, PurchaseState, Certificate, Notification types
 *
 * F004 - OCR Facturas
 *   Uses: Invoice, ExtractedFields, OCRConfidence, PriceVariance types
 *
 * F005 - Sistema Notificaciones
 *   Uses: Notification, NotificationTemplate, DeliveryAttempt, AlertPriority types
 *
 * F006 - ETL SICOM (Read-only)
 *   Uses: Material, Purchase, Project types
 *
 * F007 - Análisis de Precios y Anomalías (PREVENT CASO CARTAGENA)
 *   Uses: Material, Invoice, PriceVariance, PriceHistory types
 *
 * F008 - Gestión Certificados HSE (BLOCKING GATE)
 *   Uses: Certificate, CertificateRequirement, CertificateAlert types
 *
 * F009 - Control de Inventario
 *   Uses: Inventory, MaterialMovement, StockLevel, ConsumptionForecast types
 *
 * F010 - Proyección Financiera
 *   Uses: Project, Budget, Forecast, EVMMetrics types
 *
 * F011 - Integración Google Workspace
 *   Uses: Notification, User, Invoice types (Gmail API)
 *
 * F012 - Facturas por Email
 *   Uses: Invoice, Notification, Material types
 *
 * F013 - Mantenimiento Preventivo de Maquinaria
 *   Uses: Inventory, Notification, Certificate types
 *
 * F014 - Seguimiento EVM
 *   Uses: Project, EVMMetrics, Forecast types
 */

// ============================================================================
// REEXPORT ZODS FROM THE ENTRY POINT
// ============================================================================

export { z } from 'zod';
