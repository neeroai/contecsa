/**
 * Purchase and State Management Types
 * Contecsa Sistema de Inteligencia de Datos
 *
 * Version: 1.0 | Date: 2025-12-24 12:00
 *
 * Defines purchase order states (7 stages), transitions, and audit trails.
 * Critical for F003 Seguimiento de Compras feature.
 */

import { z } from 'zod';

/**
 * Purchase state machine - 7 stages for purchase lifecycle
 * Stage 1: REQUISICION - Purchase request created
 * Stage 2: APROBACION - Pending approval from gerencia
 * Stage 3: ORDEN - Purchase order sent to supplier
 * Stage 4: CONFIRMACION - Supplier confirms order
 * Stage 5: RECEPCION - Materials received in almacén
 * Stage 6: CERTIFICADOS - Waiting for HSE certificates (blocking gate)
 * Stage 7: CERRADO - Purchase completed and verified
 */
export type PurchaseState =
  | 'REQUISICION'
  | 'APROBACION'
  | 'ORDEN'
  | 'CONFIRMACION'
  | 'RECEPCION'
  | 'CERTIFICADOS'
  | 'CERRADO';

export const PurchaseStateEnum = {
  REQUISICION: 'REQUISICION' as const,
  APROBACION: 'APROBACION' as const,
  ORDEN: 'ORDEN' as const,
  CONFIRMACION: 'CONFIRMACION' as const,
  RECEPCION: 'RECEPCION' as const,
  CERTIFICADOS: 'CERTIFICADOS' as const,
  CERRADO: 'CERRADO' as const,
} as const;

/**
 * State metadata for UI rendering and transitions
 */
export interface StateMetadata {
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly isBlocking: boolean;
}

export const PURCHASE_STATE_METADATA: Record<PurchaseState, StateMetadata> = {
  REQUISICION: {
    label: 'Requisición',
    description: 'Solicitud de compra creada',
    icon: 'FileText',
    isBlocking: false,
  },
  APROBACION: {
    label: 'Aprobación',
    description: 'Esperando aprobación de gerencia',
    icon: 'CheckCircle2',
    isBlocking: false,
  },
  ORDEN: {
    label: 'Orden',
    description: 'Orden enviada al proveedor',
    icon: 'Send',
    isBlocking: false,
  },
  CONFIRMACION: {
    label: 'Confirmación',
    description: 'Proveedor confirmó la orden',
    icon: 'Handshake',
    isBlocking: false,
  },
  RECEPCION: {
    label: 'Recepción',
    description: 'Materiales recibidos en almacén',
    icon: 'Package',
    isBlocking: false,
  },
  CERTIFICADOS: {
    label: 'Certificados',
    description: 'Esperando certificados HSE (BLOQUEANTE)',
    icon: 'Award',
    isBlocking: true,
  },
  CERRADO: {
    label: 'Cerrado',
    description: 'Compra completada y verificada',
    icon: 'CheckSquare',
    isBlocking: false,
  },
};

/**
 * Status color indicators for UI
 * green: <15 days, <90% budget, stock >min
 * yellow: 16-30 days, 90-110% budget, near min
 * red: >30 days, >110% budget, <min
 */
export type StatusColor = 'green' | 'yellow' | 'red';

/**
 * State transition rules and valid next states
 */
export const STATE_TRANSITIONS: Record<PurchaseState, PurchaseState[]> = {
  REQUISICION: ['APROBACION'],
  APROBACION: ['ORDEN', 'REQUISICION'], // Can reject back
  ORDEN: ['CONFIRMACION', 'APROBACION'],
  CONFIRMACION: ['RECEPCION'],
  RECEPCION: ['CERTIFICADOS'],
  CERTIFICADOS: ['CERRADO', 'RECEPCION'], // Can go back if certs missing
  CERRADO: [], // Terminal state
};

/**
 * Audit log entry for state changes
 */
export interface AuditLogEntry {
  readonly id: string;
  readonly purchaseId: string;
  readonly action: 'STATE_CHANGE' | 'FIELD_UPDATE' | 'NOTE_ADDED' | 'ATTACHMENT_ADDED';
  readonly previousState?: PurchaseState;
  readonly newState?: PurchaseState;
  readonly changedFields?: Record<string, { old: unknown; new: unknown }>;
  readonly userId: string;
  readonly userName: string;
  readonly userRole: string;
  readonly comment?: string;
  readonly timestamp: Date;
}

/**
 * Purchase order model
 * 28 fields for complete tracking (from Excel analysis)
 */
export interface Purchase {
  // Identification
  readonly id: string;
  readonly poNumber: string;
  readonly requisitionId: string;
  readonly projectId: string;
  readonly consortiumName: string;

  // Current state and timeline
  readonly state: PurchaseState;
  readonly statusColor: StatusColor;
  readonly daysInProcess: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly expectedDeliveryDate: Date;
  readonly actualDeliveryDate?: Date;

  // Supplier information
  readonly supplierId: string;
  readonly supplierName: string;
  readonly supplierContact: string;
  readonly supplierEmail: string;
  readonly supplierPhone: string;

  // Material details
  readonly materials: PurchaseMaterial[];
  readonly totalQuantity: number;
  readonly description: string;

  // Financial tracking
  readonly budgetedAmount: number;
  readonly orderedAmount: number;
  readonly receivedAmount: number;
  readonly budgetVariance: number; // percentage
  readonly currencyCode: string;

  // People
  readonly requestedBy: string;
  readonly approvedBy?: string;
  readonly receivedBy?: string;
  readonly createdByUserId: string;

  // Tracking metadata
  readonly auditLog: AuditLogEntry[];
  readonly attachments: Attachment[];
  readonly notes: PurchaseNote[];
  readonly isOverdue: boolean;
  readonly alertFlags: AlertFlag[];
}

/**
 * Material line item in purchase order
 */
export interface PurchaseMaterial {
  readonly id: string;
  readonly materialId: string;
  readonly materialCode: string;
  readonly materialName: string;
  readonly category: string;
  readonly quantity: number;
  readonly unit: string;
  readonly unitPrice: number;
  readonly totalPrice: number;
  readonly receivedQuantity: number;
  readonly qualityApproved: boolean;
}

/**
 * File attachment for purchase
 */
export interface Attachment {
  readonly id: string;
  readonly fileName: string;
  readonly fileType: string;
  readonly fileSize: number;
  readonly fileUrl: string;
  readonly uploadedBy: string;
  readonly uploadedAt: Date;
  readonly documentType:
    | 'INVOICE'
    | 'CERTIFICATE'
    | 'SPECIFICATION'
    | 'DELIVERY_NOTE'
    | 'OTHER';
}

/**
 * Purchase note/comment
 */
export interface PurchaseNote {
  readonly id: string;
  readonly content: string;
  readonly author: string;
  readonly authorRole: string;
  readonly createdAt: Date;
  readonly isPublic: boolean;
}

/**
 * Alert flags for purchase
 */
export interface AlertFlag {
  readonly id: string;
  readonly type:
    | 'OVERDUE'
    | 'BUDGET_EXCEEDED'
    | 'QUALITY_ISSUE'
    | 'MISSING_CERTIFICATE'
    | 'PRICE_VARIANCE'
    | 'DELIVERY_DELAY';
  readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly message: string;
  readonly createdAt: Date;
  readonly resolvedAt?: Date;
}

/**
 * Zod Schema: Purchase State validation
 */
export const PurchaseStateSchema = z.enum([
  'REQUISICION',
  'APROBACION',
  'ORDEN',
  'CONFIRMACION',
  'RECEPCION',
  'CERTIFICADOS',
  'CERRADO',
]);

/**
 * Zod Schema: Status Color validation
 */
export const StatusColorSchema = z.enum(['green', 'yellow', 'red']);

/**
 * Zod Schema: Audit Log Entry validation
 */
export const AuditLogEntrySchema = z.object({
  id: z.string().uuid(),
  purchaseId: z.string().uuid(),
  action: z.enum(['STATE_CHANGE', 'FIELD_UPDATE', 'NOTE_ADDED', 'ATTACHMENT_ADDED']),
  previousState: PurchaseStateSchema.optional(),
  newState: PurchaseStateSchema.optional(),
  changedFields: z.record(z.object({ old: z.unknown(), new: z.unknown() })).optional(),
  userId: z.string().uuid(),
  userName: z.string().min(1),
  userRole: z.string().min(1),
  comment: z.string().optional(),
  timestamp: z.date(),
});

/**
 * Zod Schema: Purchase Material validation
 */
export const PurchaseMaterialSchema = z.object({
  id: z.string().uuid(),
  materialId: z.string().uuid(),
  materialCode: z.string().min(1),
  materialName: z.string().min(1),
  category: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  unitPrice: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
  receivedQuantity: z.number().nonnegative(),
  qualityApproved: z.boolean(),
});

/**
 * Zod Schema: Attachment validation
 */
export const AttachmentSchema = z.object({
  id: z.string().uuid(),
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().positive(),
  fileUrl: z.string().url(),
  uploadedBy: z.string().uuid(),
  uploadedAt: z.date(),
  documentType: z.enum(['INVOICE', 'CERTIFICATE', 'SPECIFICATION', 'DELIVERY_NOTE', 'OTHER']),
});

/**
 * Zod Schema: Purchase Note validation
 */
export const PurchaseNoteSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1),
  author: z.string().uuid(),
  authorRole: z.string().min(1),
  createdAt: z.date(),
  isPublic: z.boolean(),
});

/**
 * Zod Schema: Alert Flag validation
 */
export const AlertFlagSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    'OVERDUE',
    'BUDGET_EXCEEDED',
    'QUALITY_ISSUE',
    'MISSING_CERTIFICATE',
    'PRICE_VARIANCE',
    'DELIVERY_DELAY',
  ]),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  message: z.string().min(1),
  createdAt: z.date(),
  resolvedAt: z.date().optional(),
});

/**
 * Zod Schema: Purchase validation
 */
export const PurchaseSchema = z.object({
  id: z.string().uuid(),
  poNumber: z.string().min(1),
  requisitionId: z.string().uuid(),
  projectId: z.string().uuid(),
  consortiumName: z.string().min(1),
  state: PurchaseStateSchema,
  statusColor: StatusColorSchema,
  daysInProcess: z.number().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date(),
  expectedDeliveryDate: z.date(),
  actualDeliveryDate: z.date().optional(),
  supplierId: z.string().uuid(),
  supplierName: z.string().min(1),
  supplierContact: z.string().min(1),
  supplierEmail: z.string().email(),
  supplierPhone: z.string().min(1),
  materials: z.array(PurchaseMaterialSchema),
  totalQuantity: z.number().positive(),
  description: z.string().min(1),
  budgetedAmount: z.number().nonnegative(),
  orderedAmount: z.number().nonnegative(),
  receivedAmount: z.number().nonnegative(),
  budgetVariance: z.number(), // percentage, can be negative
  currencyCode: z.string().length(3),
  requestedBy: z.string().uuid(),
  approvedBy: z.string().uuid().optional(),
  receivedBy: z.string().uuid().optional(),
  createdByUserId: z.string().uuid(),
  auditLog: z.array(AuditLogEntrySchema),
  attachments: z.array(AttachmentSchema),
  notes: z.array(PurchaseNoteSchema),
  isOverdue: z.boolean(),
  alertFlags: z.array(AlertFlagSchema),
});

/**
 * Type inference from Zod schema
 */
export type PurchaseType = z.infer<typeof PurchaseSchema>;
export type PurchaseMaterialType = z.infer<typeof PurchaseMaterialSchema>;
export type AttachmentType = z.infer<typeof AttachmentSchema>;
export type PurchaseNoteType = z.infer<typeof PurchaseNoteSchema>;
export type AlertFlagType = z.infer<typeof AlertFlagSchema>;
export type AuditLogEntryType = z.infer<typeof AuditLogEntrySchema>;
