/**
 * @file Certificate and HSE Compliance Types
 * @description Tipos para certificados de calidad, seguridad y cumplimiento HSE
 * @module lib/mockup-data/types/certificate
 * @exports CertificateType, CertificateTypeEnum, CertificateTypeMetadata, CertificateStatus, CertificateStatusEnum, CertificateVerification, Certificate, CertificateRequirement, CertificateAlert, CertificateReport, CertificateBlockerStatus, CertificateBatchUpdate, CertificateTypeSchema, CertificateStatusSchema, CertificateVerificationSchema, CertificateSchema, CertificateRequirementSchema, CertificateAlertSchema, CertificateBlockerStatusSchema, CertificateReportSchema
 */

import { z } from 'zod';

/**
 * Certificate types - 4 main categories
 */
export type CertificateType = 'CALIDAD' | 'SEGURIDAD' | 'AMBIENTAL' | 'FACTURA';

export const CertificateTypeEnum = {
  CALIDAD: 'CALIDAD' as const,
  SEGURIDAD: 'SEGURIDAD' as const,
  AMBIENTAL: 'AMBIENTAL' as const,
  FACTURA: 'FACTURA' as const,
} as const;

/**
 * Certificate type metadata
 */
export interface CertificateTypeMetadata {
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly isBlocker: boolean; // blocks purchase closure
  readonly retentionYears: number;
}

export const CERTIFICATE_TYPE_METADATA: Record<CertificateType, CertificateTypeMetadata> = {
  CALIDAD: {
    label: 'Calidad',
    description: 'Certificado de Calidad de Materiales',
    icon: 'Award',
    isBlocker: true,
    retentionYears: 7,
  },
  SEGURIDAD: {
    label: 'Seguridad',
    description: 'Certificado de Seguridad HSE',
    icon: 'Shield',
    isBlocker: true,
    retentionYears: 7,
  },
  AMBIENTAL: {
    label: 'Ambiental',
    description: 'Certificado Ambiental',
    icon: 'Leaf',
    isBlocker: false,
    retentionYears: 7,
  },
  FACTURA: {
    label: 'Factura',
    description: 'Certificado de Factura',
    icon: 'FileText',
    isBlocker: false,
    retentionYears: 7,
  },
};

/**
 * Certificate status
 */
export type CertificateStatus =
  | 'PENDING'
  | 'RECEIVED'
  | 'VERIFIED'
  | 'VALID'
  | 'EXPIRED'
  | 'REJECTED'
  | 'MISSING';

export const CertificateStatusEnum = {
  PENDING: 'PENDING' as const,
  RECEIVED: 'RECEIVED' as const,
  VERIFIED: 'VERIFIED' as const,
  VALID: 'VALID' as const,
  EXPIRED: 'EXPIRED' as const,
  REJECTED: 'REJECTED' as const,
  MISSING: 'MISSING' as const,
} as const;

/**
 * Certificate verification
 */
export interface CertificateVerification {
  readonly id: string;
  readonly certificateId: string;
  readonly verifiedBy: string;
  readonly verifiedAt: Date;
  readonly isValid: boolean;
  readonly issues?: string[];
  readonly comments?: string;
}

/**
 * Certificate model
 */
export interface Certificate {
  readonly id: string;
  readonly certificateNumber: string;
  readonly certificateType: CertificateType;
  readonly issuerName: string;
  readonly issuerCode?: string;

  // Purchase relationship
  readonly purchaseId: string;
  readonly poNumber: string;
  readonly materialId?: string;
  readonly materialName?: string;

  // Supplier
  readonly supplierId: string;
  readonly supplierName: string;

  // Dates
  readonly issuedDate: Date;
  readonly expiryDate: Date;
  readonly validFrom: Date;
  readonly validUntil: Date;
  readonly daysUntilExpiry: number;
  readonly isExpired: boolean;

  // Document
  readonly documentUrl: string;
  readonly fileSize: number;
  readonly fileFormat: string;
  readonly uploadedAt: Date;
  readonly uploadedBy: string;

  // Status tracking
  readonly status: CertificateStatus;
  readonly statusUpdatedAt: Date;
  readonly statusUpdatedBy: string;

  // Verification
  readonly verification?: CertificateVerification;
  readonly requiresVerification: boolean;
  readonly isVerified: boolean;
  readonly verificationNotes?: string;

  // Compliance
  readonly isBlocker: boolean; // blocks purchase closure if missing/invalid
  readonly blocksCompletion: boolean; // can't close purchase without this
  readonly complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING';

  // Retention
  readonly retentionYears: number;
  readonly retentionEndDate: Date;
  readonly canBePurged: boolean;

  // Archive
  readonly archivedAt?: Date;
  readonly archivedLocation?: string;

  // Metadata
  readonly notes?: string;
  readonly tags: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdBy: string;
  readonly updatedBy: string;
}

/**
 * Certificate requirement for purchase
 */
export interface CertificateRequirement {
  readonly id: string;
  readonly purchaseId: string;
  readonly certificateType: CertificateType;
  readonly isRequired: boolean;
  readonly isBlocker: boolean;
  readonly deadline: Date;
  readonly status: 'PENDING' | 'SATISFIED' | 'OVERDUE' | 'WAIVED';
  readonly waiverReason?: string;
  readonly waiverApprovedBy?: string;
  readonly certificateId?: string;
}

/**
 * Certificate alert for tracking
 */
export interface CertificateAlert {
  readonly id: string;
  readonly certificateId: string;
  readonly alertType:
    | 'EXPIRY_APPROACHING'
    | 'EXPIRED'
    | 'MISSING'
    | 'VERIFICATION_FAILED'
    | 'REJECTED'
    | 'RETENTION_ENDING';
  readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly message: string;
  readonly actionRequired: string;
  readonly createdAt: Date;
  readonly resolvedAt?: Date;
}

/**
 * Certificate report for compliance
 */
export interface CertificateReport {
  readonly reportId: string;
  readonly generatedAt: Date;
  readonly generatedBy: string;
  readonly period: string; // YYYY-MM or date range
  readonly totalCertificates: number;
  readonly validCertificates: number;
  readonly expiredCertificates: number;
  readonly expiringSoon: number; // <30 days
  readonly missingCertificates: number;
  readonly complianceRate: number; // percentage
  readonly blockersStatus: CertificateBlockerStatus[];
}

/**
 * Certificate blocker status for purchase
 */
export interface CertificateBlockerStatus {
  readonly purchaseId: string;
  readonly poNumber: string;
  readonly certificateType: CertificateType;
  readonly status: CertificateStatus;
  readonly isBlocking: boolean;
  readonly deadline: Date;
  readonly daysUntilDeadline: number;
  readonly certificate?: Certificate;
}

/**
 * Certificate batch operation
 */
export interface CertificateBatchUpdate {
  readonly certificateIds: string[];
  readonly newStatus: CertificateStatus;
  readonly reason: string;
  readonly updatedBy: string;
  readonly timestamp: Date;
}

/**
 * Zod Schema: Certificate Type validation
 */
export const CertificateTypeSchema = z.enum(['CALIDAD', 'SEGURIDAD', 'AMBIENTAL', 'FACTURA']);

/**
 * Zod Schema: Certificate Status validation
 */
export const CertificateStatusSchema = z.enum([
  'PENDING',
  'RECEIVED',
  'VERIFIED',
  'VALID',
  'EXPIRED',
  'REJECTED',
  'MISSING',
]);

/**
 * Zod Schema: Certificate Verification validation
 */
export const CertificateVerificationSchema = z.object({
  id: z.string().uuid(),
  certificateId: z.string().uuid(),
  verifiedBy: z.string().uuid(),
  verifiedAt: z.date(),
  isValid: z.boolean(),
  issues: z.array(z.string()).optional(),
  comments: z.string().optional(),
});

/**
 * Zod Schema: Certificate validation
 */
export const CertificateSchema = z.object({
  id: z.string().uuid(),
  certificateNumber: z.string().min(1),
  certificateType: CertificateTypeSchema,
  issuerName: z.string().min(1),
  issuerCode: z.string().optional(),
  purchaseId: z.string().uuid(),
  poNumber: z.string().min(1),
  materialId: z.string().uuid().optional(),
  materialName: z.string().optional(),
  supplierId: z.string().uuid(),
  supplierName: z.string().min(1),
  issuedDate: z.date(),
  expiryDate: z.date(),
  validFrom: z.date(),
  validUntil: z.date(),
  daysUntilExpiry: z.number(),
  isExpired: z.boolean(),
  documentUrl: z.string().url(),
  fileSize: z.number().positive(),
  fileFormat: z.string().min(1),
  uploadedAt: z.date(),
  uploadedBy: z.string().uuid(),
  status: CertificateStatusSchema,
  statusUpdatedAt: z.date(),
  statusUpdatedBy: z.string().uuid(),
  verification: CertificateVerificationSchema.optional(),
  requiresVerification: z.boolean(),
  isVerified: z.boolean(),
  verificationNotes: z.string().optional(),
  isBlocker: z.boolean(),
  blocksCompletion: z.boolean(),
  complianceStatus: z.enum(['COMPLIANT', 'NON_COMPLIANT', 'PENDING']),
  retentionYears: z.number().positive(),
  retentionEndDate: z.date(),
  canBePurged: z.boolean(),
  archivedAt: z.date().optional(),
  archivedLocation: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid(),
});

/**
 * Zod Schema: Certificate Requirement validation
 */
export const CertificateRequirementSchema = z.object({
  id: z.string().uuid(),
  purchaseId: z.string().uuid(),
  certificateType: CertificateTypeSchema,
  isRequired: z.boolean(),
  isBlocker: z.boolean(),
  deadline: z.date(),
  status: z.enum(['PENDING', 'SATISFIED', 'OVERDUE', 'WAIVED']),
  waiverReason: z.string().optional(),
  waiverApprovedBy: z.string().uuid().optional(),
  certificateId: z.string().uuid().optional(),
});

/**
 * Zod Schema: Certificate Alert validation
 */
export const CertificateAlertSchema = z.object({
  id: z.string().uuid(),
  certificateId: z.string().uuid(),
  alertType: z.enum([
    'EXPIRY_APPROACHING',
    'EXPIRED',
    'MISSING',
    'VERIFICATION_FAILED',
    'REJECTED',
    'RETENTION_ENDING',
  ]),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  message: z.string().min(1),
  actionRequired: z.string().min(1),
  createdAt: z.date(),
  resolvedAt: z.date().optional(),
});

/**
 * Zod Schema: Certificate Blocker Status validation
 */
export const CertificateBlockerStatusSchema = z.object({
  purchaseId: z.string().uuid(),
  poNumber: z.string().min(1),
  certificateType: CertificateTypeSchema,
  status: CertificateStatusSchema,
  isBlocking: z.boolean(),
  deadline: z.date(),
  daysUntilDeadline: z.number(),
  certificate: CertificateSchema.optional(),
});

/**
 * Zod Schema: Certificate Report validation
 */
export const CertificateReportSchema = z.object({
  reportId: z.string().uuid(),
  generatedAt: z.date(),
  generatedBy: z.string().uuid(),
  period: z.string().min(1),
  totalCertificates: z.number().nonnegative(),
  validCertificates: z.number().nonnegative(),
  expiredCertificates: z.number().nonnegative(),
  expiringSoon: z.number().nonnegative(),
  missingCertificates: z.number().nonnegative(),
  complianceRate: z.number().min(0).max(100),
  blockersStatus: z.array(CertificateBlockerStatusSchema),
});

/**
 * Type inference from Zod schemas
 */
export type CertificateType_Inferred = z.infer<typeof CertificateSchema>;
export type CertificateVerificationType = z.infer<typeof CertificateVerificationSchema>;
export type CertificateRequirementType = z.infer<typeof CertificateRequirementSchema>;
export type CertificateAlertType = z.infer<typeof CertificateAlertSchema>;
export type CertificateBlockerStatusType = z.infer<typeof CertificateBlockerStatusSchema>;
export type CertificateReportType = z.infer<typeof CertificateReportSchema>;
