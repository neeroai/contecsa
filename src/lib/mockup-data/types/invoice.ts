/**
 * Invoice and OCR Types
 * Contecsa Sistema de Inteligencia de Datos
 *
 * Version: 1.0 | Date: 2025-12-24 12:00
 *
 * Defines invoice models, OCR extraction, and validation.
 * Critical for F004 OCR Facturas and F007 Análisis de Precios features.
 * 198 invoices tracked (66/month × 3 months)
 */

import { z } from 'zod';

/**
 * OCR confidence level
 */
export type OCRConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export const OCRConfidenceEnum = {
  HIGH: 'HIGH' as const,
  MEDIUM: 'MEDIUM' as const,
  LOW: 'LOW' as const,
} as const;

/**
 * Invoice status workflow
 */
export type InvoiceStatus =
  | 'PENDING_OCR'
  | 'OCR_EXTRACTED'
  | 'PENDING_REVIEW'
  | 'VALIDATED'
  | 'ANOMALY_DETECTED'
  | 'PAID'
  | 'REJECTED';

export const InvoiceStatusEnum = {
  PENDING_OCR: 'PENDING_OCR' as const,
  OCR_EXTRACTED: 'OCR_EXTRACTED' as const,
  PENDING_REVIEW: 'PENDING_REVIEW' as const,
  VALIDATED: 'VALIDATED' as const,
  ANOMALY_DETECTED: 'ANOMALY_DETECTED' as const,
  PAID: 'PAID' as const,
  REJECTED: 'REJECTED' as const,
} as const;

/**
 * Fields extracted via OCR from invoice document
 * 15 critical fields with confidence scores
 */
export interface ExtractedFields {
  readonly invoiceNumber: ExtractedField<string>;
  readonly issueDate: ExtractedField<Date>;
  readonly dueDate: ExtractedField<Date>;
  readonly supplierName: ExtractedField<string>;
  readonly supplierTax: ExtractedField<string>;
  readonly supplierAddress: ExtractedField<string>;
  readonly supplierPhone: ExtractedField<string>;
  readonly supplierEmail: ExtractedField<string>;
  readonly buyerName: ExtractedField<string>;
  readonly buyerTax: ExtractedField<string>;
  readonly buyerAddress: ExtractedField<string>;
  readonly subtotal: ExtractedField<number>;
  readonly taxAmount: ExtractedField<number>;
  readonly totalAmount: ExtractedField<number>;
  readonly description: ExtractedField<string>;
  readonly paymentTerms?: ExtractedField<string>;
  readonly currency?: ExtractedField<string>;
}

/**
 * Single extracted field with OCR confidence
 */
export interface ExtractedField<T> {
  readonly value: T;
  readonly confidence: OCRConfidence;
  readonly rawText?: string;
}

/**
 * Validation result after invoice extraction
 */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: ValidationError[];
  readonly warnings: ValidationWarning[];
  readonly requiresManualReview: boolean;
}

/**
 * Validation error
 */
export interface ValidationError {
  readonly field: string;
  readonly code: string;
  readonly message: string;
  readonly severity: 'ERROR';
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  readonly field: string;
  readonly code: string;
  readonly message: string;
  readonly severity: 'WARNING';
}

/**
 * Price variance for anomaly detection
 * Critical for F007 preventing Caso Cartagena
 */
export interface PriceVariance {
  readonly materialId: string;
  readonly materialName: string;
  readonly previousPrice: number;
  readonly currentPrice: number;
  readonly priceChange: number; // percentage
  readonly variance: number; // absolute amount
  readonly anomalySeverity: 'MED' | 'HIGH' | 'CRIT';
  readonly detectedAt: Date;
  readonly resolvedAt?: Date;
  readonly resolutionNotes?: string;
}

/**
 * Invoice model - complete tracking
 * Contains OCR data, validation, and pricing analysis
 */
export interface Invoice {
  readonly id: string;
  readonly purchaseId: string;
  readonly status: InvoiceStatus;

  // Document metadata
  readonly documentUrl: string;
  readonly uploadedAt: Date;
  readonly uploadedBy: string;
  readonly fileName: string;
  readonly fileSize: number;

  // OCR extraction
  readonly extractedFields: ExtractedFields;
  readonly extractionTimestamp: Date;
  readonly extractionMethod: 'GOOGLE_VISION' | 'AWS_TEXTRACT' | 'MANUAL';

  // Validation
  readonly validationResult: ValidationResult;
  readonly validationTimestamp: Date;

  // Financial tracking
  readonly invoiceNumber: string;
  readonly issueDate: Date;
  readonly dueDate: Date;
  readonly amount: number;
  readonly taxAmount: number;
  readonly totalAmount: number;
  readonly currencyCode: string;

  // Supplier info
  readonly supplierId: string;
  readonly supplierName: string;
  readonly supplierTax: string;

  // Buyer info
  readonly buyerName: string;
  readonly buyerTax: string;

  // Pricing analysis (F007)
  readonly priceVariances: PriceVariance[];
  readonly hasAnomalies: boolean;
  readonly anomalySeverity?: 'MED' | 'HIGH' | 'CRIT';

  // Review workflow
  readonly reviewedBy?: string;
  readonly reviewedAt?: Date;
  readonly reviewNotes?: string;
  readonly rejectionReason?: string;

  // Matching
  readonly matchedPurchaseLines: InvoiceLineMatch[];
  readonly unmatchedLines: string[];
  readonly matchingStatus: 'UNMATCHED' | 'PARTIAL' | 'COMPLETE';

  // Payment tracking
  readonly paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID';
  readonly paidAmount?: number;
  readonly paidDate?: Date;

  // Audit trail
  readonly auditLog: InvoiceAuditEntry[];
  readonly attachments: InvoiceAttachment[];

  // Timestamps
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Matched line item between invoice and purchase order
 */
export interface InvoiceLineMatch {
  readonly id: string;
  readonly invoiceLineNumber: number;
  readonly purchaseLineId: string;
  readonly description: string;
  readonly invoiceQuantity: number;
  readonly invoiceUnitPrice: number;
  readonly invoiceTotal: number;
  readonly purchaseQuantity: number;
  readonly purchaseUnitPrice: number;
  readonly quantityMatch: boolean;
  readonly priceMatch: boolean;
  readonly priceVariance: number; // percentage
}

/**
 * Invoice attachment (supplementary docs)
 */
export interface InvoiceAttachment {
  readonly id: string;
  readonly fileName: string;
  readonly fileType: string;
  readonly fileSize: number;
  readonly fileUrl: string;
  readonly documentType: 'INVOICE' | 'DELIVERY_NOTE' | 'CERTIFICATE' | 'OTHER';
  readonly uploadedAt: Date;
}

/**
 * Audit entry for invoice
 */
export interface InvoiceAuditEntry {
  readonly id: string;
  readonly invoiceId: string;
  readonly action:
    | 'UPLOADED'
    | 'OCR_EXECUTED'
    | 'VALIDATED'
    | 'REVIEWED'
    | 'APPROVED'
    | 'REJECTED'
    | 'ANOMALY_FLAGGED'
    | 'RESOLVED';
  readonly userId: string;
  readonly userName: string;
  readonly details?: Record<string, unknown>;
  readonly timestamp: Date;
}

/**
 * Zod Schema: OCR Confidence validation
 */
export const OCRConfidenceSchema = z.enum(['HIGH', 'MEDIUM', 'LOW']);

/**
 * Zod Schema: Invoice Status validation
 */
export const InvoiceStatusSchema = z.enum([
  'PENDING_OCR',
  'OCR_EXTRACTED',
  'PENDING_REVIEW',
  'VALIDATED',
  'ANOMALY_DETECTED',
  'PAID',
  'REJECTED',
]);

/**
 * Zod Schema: Extracted Field validation
 */
export const ExtractedFieldSchema = <T extends z.ZodTypeAny>(innerSchema: T) =>
  z.object({
    value: innerSchema,
    confidence: OCRConfidenceSchema,
    rawText: z.string().optional(),
  });

/**
 * Zod Schema: Extracted Fields validation
 */
export const ExtractedFieldsSchema = z.object({
  invoiceNumber: ExtractedFieldSchema(z.string().min(1)),
  issueDate: ExtractedFieldSchema(z.date()),
  dueDate: ExtractedFieldSchema(z.date()),
  supplierName: ExtractedFieldSchema(z.string().min(1)),
  supplierTax: ExtractedFieldSchema(z.string().min(1)),
  supplierAddress: ExtractedFieldSchema(z.string().min(1)),
  supplierPhone: ExtractedFieldSchema(z.string().min(1)),
  supplierEmail: ExtractedFieldSchema(z.string().email()),
  buyerName: ExtractedFieldSchema(z.string().min(1)),
  buyerTax: ExtractedFieldSchema(z.string().min(1)),
  buyerAddress: ExtractedFieldSchema(z.string().min(1)),
  subtotal: ExtractedFieldSchema(z.number().nonnegative()),
  taxAmount: ExtractedFieldSchema(z.number().nonnegative()),
  totalAmount: ExtractedFieldSchema(z.number().nonnegative()),
  description: ExtractedFieldSchema(z.string().min(1)),
  paymentTerms: ExtractedFieldSchema(z.string()).optional(),
  currency: ExtractedFieldSchema(z.string()).optional(),
});

/**
 * Zod Schema: Validation Error validation
 */
export const ValidationErrorSchema = z.object({
  field: z.string().min(1),
  code: z.string().min(1),
  message: z.string().min(1),
  severity: z.literal('ERROR'),
});

/**
 * Zod Schema: Validation Warning validation
 */
export const ValidationWarningSchema = z.object({
  field: z.string().min(1),
  code: z.string().min(1),
  message: z.string().min(1),
  severity: z.literal('WARNING'),
});

/**
 * Zod Schema: Validation Result validation
 */
export const ValidationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(ValidationErrorSchema),
  warnings: z.array(ValidationWarningSchema),
  requiresManualReview: z.boolean(),
});

/**
 * Zod Schema: Price Variance validation
 */
export const PriceVarianceSchema = z.object({
  materialId: z.string().uuid(),
  materialName: z.string().min(1),
  previousPrice: z.number().nonnegative(),
  currentPrice: z.number().nonnegative(),
  priceChange: z.number(),
  variance: z.number(),
  anomalySeverity: z.enum(['MED', 'HIGH', 'CRIT']),
  detectedAt: z.date(),
  resolvedAt: z.date().optional(),
  resolutionNotes: z.string().optional(),
});

/**
 * Zod Schema: Invoice Line Match validation
 */
export const InvoiceLineMatchSchema = z.object({
  id: z.string().uuid(),
  invoiceLineNumber: z.number().positive(),
  purchaseLineId: z.string().uuid(),
  description: z.string().min(1),
  invoiceQuantity: z.number().positive(),
  invoiceUnitPrice: z.number().nonnegative(),
  invoiceTotal: z.number().nonnegative(),
  purchaseQuantity: z.number().positive(),
  purchaseUnitPrice: z.number().nonnegative(),
  quantityMatch: z.boolean(),
  priceMatch: z.boolean(),
  priceVariance: z.number(),
});

/**
 * Zod Schema: Invoice Attachment validation
 */
export const InvoiceAttachmentSchema = z.object({
  id: z.string().uuid(),
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().positive(),
  fileUrl: z.string().url(),
  documentType: z.enum(['INVOICE', 'DELIVERY_NOTE', 'CERTIFICATE', 'OTHER']),
  uploadedAt: z.date(),
});

/**
 * Zod Schema: Invoice Audit Entry validation
 */
export const InvoiceAuditEntrySchema = z.object({
  id: z.string().uuid(),
  invoiceId: z.string().uuid(),
  action: z.enum([
    'UPLOADED',
    'OCR_EXECUTED',
    'VALIDATED',
    'REVIEWED',
    'APPROVED',
    'REJECTED',
    'ANOMALY_FLAGGED',
    'RESOLVED',
  ]),
  userId: z.string().uuid(),
  userName: z.string().min(1),
  details: z.record(z.unknown()).optional(),
  timestamp: z.date(),
});

/**
 * Zod Schema: Invoice validation
 */
export const InvoiceSchema = z.object({
  id: z.string().uuid(),
  purchaseId: z.string().uuid(),
  status: InvoiceStatusSchema,
  documentUrl: z.string().url(),
  uploadedAt: z.date(),
  uploadedBy: z.string().uuid(),
  fileName: z.string().min(1),
  fileSize: z.number().positive(),
  extractedFields: ExtractedFieldsSchema,
  extractionTimestamp: z.date(),
  extractionMethod: z.enum(['GOOGLE_VISION', 'AWS_TEXTRACT', 'MANUAL']),
  validationResult: ValidationResultSchema,
  validationTimestamp: z.date(),
  invoiceNumber: z.string().min(1),
  issueDate: z.date(),
  dueDate: z.date(),
  amount: z.number().nonnegative(),
  taxAmount: z.number().nonnegative(),
  totalAmount: z.number().nonnegative(),
  currencyCode: z.string().length(3),
  supplierId: z.string().uuid(),
  supplierName: z.string().min(1),
  supplierTax: z.string().min(1),
  buyerName: z.string().min(1),
  buyerTax: z.string().min(1),
  priceVariances: z.array(PriceVarianceSchema),
  hasAnomalies: z.boolean(),
  anomalySeverity: z.enum(['MED', 'HIGH', 'CRIT']).optional(),
  reviewedBy: z.string().uuid().optional(),
  reviewedAt: z.date().optional(),
  reviewNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
  matchedPurchaseLines: z.array(InvoiceLineMatchSchema),
  unmatchedLines: z.array(z.string()),
  matchingStatus: z.enum(['UNMATCHED', 'PARTIAL', 'COMPLETE']),
  paymentStatus: z.enum(['PENDING', 'PARTIAL', 'PAID']),
  paidAmount: z.number().nonnegative().optional(),
  paidDate: z.date().optional(),
  auditLog: z.array(InvoiceAuditEntrySchema),
  attachments: z.array(InvoiceAttachmentSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Type inference from Zod schemas
 */
export type InvoiceType = z.infer<typeof InvoiceSchema>;
export type ExtractedFieldsType = z.infer<typeof ExtractedFieldsSchema>;
export type ValidationResultType = z.infer<typeof ValidationResultSchema>;
export type PriceVarianceType = z.infer<typeof PriceVarianceSchema>;
export type InvoiceLineMatchType = z.infer<typeof InvoiceLineMatchSchema>;
export type InvoiceAttachmentType = z.infer<typeof InvoiceAttachmentSchema>;
export type InvoiceAuditEntryType = z.infer<typeof InvoiceAuditEntrySchema>;
