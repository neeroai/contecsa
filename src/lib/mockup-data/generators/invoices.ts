/**
 * @file Invoices Data Generator
 * @description Genera 198 facturas con extracción OCR y detección de anomalías (Caso Cartagena)
 * @module lib/mockup-data/generators/invoices
 * @exports generateInvoices, INVOICES, getCasoCartagenaInvoices, getInvoicesByStatus, getInvoicesWithAnomalies, getInvoicesByPurchase, getInvoiceStats
 */

import type {
  ExtractedField,
  ExtractedFields,
  Invoice,
  InvoiceAttachment,
  InvoiceAuditEntry,
  InvoiceLineMatch,
  InvoiceStatus,
  OCRConfidence,
  PriceVariance,
  ValidationError,
  ValidationResult,
  ValidationWarning,
} from '../types';
import { PURCHASES } from './purchases';
import { getLicedVega, getUsersByRole } from './users';
import {
  addDays,
  deterministicUUID,
  generateInvoiceNumber,
  generateNIT,
  getCurrentDate,
  rng,
  subtractDays,
  subtractMonths,
} from './utils';

/**
 * Generate extracted field with confidence
 */
function createExtractedField<T>(
  value: T,
  confidence: OCRConfidence = 'HIGH',
  rawText?: string,
): ExtractedField<T> {
  return { value, confidence, rawText };
}

/**
 * Generate OCR extracted fields from purchase data
 */
function generateExtractedFields(
  invoiceNumber: string,
  issueDate: Date,
  dueDate: Date,
  supplier: { name: string; nit: string; address: string; phone: string; email: string },
  amount: number,
  taxAmount: number,
  totalAmount: number,
  description: string,
): ExtractedFields {
  // Simulate OCR confidence based on document quality
  const confidence: OCRConfidence = rng.pick(['HIGH', 'HIGH', 'HIGH', 'MEDIUM']);

  return {
    invoiceNumber: createExtractedField(invoiceNumber, confidence),
    issueDate: createExtractedField(issueDate, confidence),
    dueDate: createExtractedField(dueDate, confidence),
    supplierName: createExtractedField(supplier.name, confidence),
    supplierTax: createExtractedField(supplier.nit, 'HIGH'),
    supplierAddress: createExtractedField(supplier.address, confidence),
    supplierPhone: createExtractedField(supplier.phone, confidence),
    supplierEmail: createExtractedField(supplier.email, confidence),
    buyerName: createExtractedField('Contecsa S.A.', 'HIGH'),
    buyerTax: createExtractedField('900123456-7', 'HIGH'),
    buyerAddress: createExtractedField('Calle 100 # 19-61 Bogotá', 'HIGH'),
    subtotal: createExtractedField(amount, 'HIGH'),
    taxAmount: createExtractedField(taxAmount, 'HIGH'),
    totalAmount: createExtractedField(totalAmount, 'HIGH'),
    description: createExtractedField(description, confidence),
    paymentTerms: createExtractedField('30 días', 'MEDIUM'),
    currency: createExtractedField('COP', 'HIGH'),
  };
}

/**
 * Generate validation result
 */
function generateValidationResult(
  _hasAnomalies: boolean,
  priceVariances: PriceVariance[],
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Add errors for critical anomalies
  const criticalVariances = priceVariances.filter((v) => v.anomalySeverity === 'CRIT');
  criticalVariances.forEach((variance) => {
    errors.push({
      field: 'priceVariance',
      code: 'CRITICAL_PRICE_ANOMALY',
      message: `CASO CARTAGENA: ${variance.materialName} precio aumentó ${variance.priceChange.toFixed(1)}% (${variance.variance.toLocaleString('es-CO')} COP)`,
      severity: 'ERROR',
    });
  });

  // Add warnings for medium/high anomalies
  const highVariances = priceVariances.filter(
    (v) => v.anomalySeverity === 'HIGH' || v.anomalySeverity === 'MED',
  );
  highVariances.forEach((variance) => {
    warnings.push({
      field: 'priceVariance',
      code: 'PRICE_VARIANCE_DETECTED',
      message: `${variance.materialName} precio varió ${variance.priceChange.toFixed(1)}%`,
      severity: 'WARNING',
    });
  });

  const isValid = errors.length === 0;
  const requiresManualReview = errors.length > 0 || warnings.length > 0;

  return {
    isValid,
    errors,
    warnings,
    requiresManualReview,
  };
}

/**
 * Generate price variance (for Caso Cartagena)
 */
function generatePriceVariance(
  materialId: string,
  materialName: string,
  previousPrice: number,
  currentPrice: number,
  isCasoCartagena = false,
): PriceVariance {
  const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
  const variance = currentPrice - previousPrice;

  let anomalySeverity: 'MED' | 'HIGH' | 'CRIT';

  if (isCasoCartagena || Math.abs(priceChange) > 15) {
    anomalySeverity = 'CRIT';
  } else if (Math.abs(priceChange) > 10) {
    anomalySeverity = 'HIGH';
  } else {
    anomalySeverity = 'MED';
  }

  return {
    materialId,
    materialName,
    previousPrice,
    currentPrice,
    priceChange,
    variance,
    anomalySeverity,
    detectedAt: getCurrentDate(),
    resolvedAt: isCasoCartagena ? undefined : subtractDays(getCurrentDate(), rng.int(1, 10)),
    resolutionNotes: isCasoCartagena
      ? undefined
      : 'Variación verificada con proveedor, precio correcto',
  };
}

/**
 * Generate matched purchase lines
 */
function generateInvoiceLineMatches(purchase: any, isCasoCartagena: boolean): InvoiceLineMatch[] {
  return purchase.materials.map((material: any, index: number) => {
    // For Caso Cartagena, introduce price variance in first material
    const priceVariance = isCasoCartagena && index === 0 ? rng.float(15, 20) : rng.float(-2, 2);

    const invoiceUnitPrice = material.unitPrice * (1 + priceVariance / 100);
    const invoiceTotal = material.quantity * invoiceUnitPrice;
    const priceMatch = Math.abs(priceVariance) < 5;

    return {
      id: deterministicUUID(`line-match-${purchase.id}-${index}`),
      invoiceLineNumber: index + 1,
      purchaseLineId: material.id,
      description: material.materialName,
      invoiceQuantity: material.quantity,
      invoiceUnitPrice,
      invoiceTotal,
      purchaseQuantity: material.quantity,
      purchaseUnitPrice: material.unitPrice,
      quantityMatch: true,
      priceMatch,
      priceVariance,
    };
  });
}

/**
 * Generate invoice attachments
 */
function generateInvoiceAttachments(invoiceId: string): InvoiceAttachment[] {
  return [
    {
      id: deterministicUUID(`inv-attach-${invoiceId}-1`),
      fileName: 'factura_original.pdf',
      fileType: 'application/pdf',
      fileSize: rng.int(200000, 1500000),
      fileUrl: `https://storage.contecsa.com/invoices/${invoiceId}/original.pdf`,
      documentType: 'INVOICE',
      uploadedAt: subtractDays(getCurrentDate(), rng.int(1, 30)),
    },
  ];
}

/**
 * Generate audit log
 */
function generateInvoiceAuditLog(
  invoiceId: string,
  status: InvoiceStatus,
  hasAnomalies: boolean,
): InvoiceAuditEntry[] {
  const log: InvoiceAuditEntry[] = [];
  const liced = getLicedVega();
  const contabilidadUsers = getUsersByRole('contabilidad');
  const contabilidadUser = contabilidadUsers.length > 0 ? contabilidadUsers[0] : liced;

  // Upload
  log.push({
    id: deterministicUUID(`inv-audit-${invoiceId}-upload`),
    invoiceId,
    action: 'UPLOADED',
    userId: liced.id,
    userName: `${liced.firstName} ${liced.lastName}`,
    timestamp: subtractDays(getCurrentDate(), rng.int(5, 30)),
  });

  // OCR
  log.push({
    id: deterministicUUID(`inv-audit-${invoiceId}-ocr`),
    invoiceId,
    action: 'OCR_EXECUTED',
    userId: 'system',
    userName: 'Sistema OCR',
    details: { method: rng.pick(['GOOGLE_VISION', 'AWS_TEXTRACT']) },
    timestamp: subtractDays(getCurrentDate(), rng.int(4, 29)),
  });

  // Validation
  log.push({
    id: deterministicUUID(`inv-audit-${invoiceId}-validate`),
    invoiceId,
    action: 'VALIDATED',
    userId: 'system',
    userName: 'Sistema Validación',
    timestamp: subtractDays(getCurrentDate(), rng.int(3, 28)),
  });

  // Anomaly flagged (if applicable)
  if (hasAnomalies) {
    log.push({
      id: deterministicUUID(`inv-audit-${invoiceId}-anomaly`),
      invoiceId,
      action: 'ANOMALY_FLAGGED',
      userId: 'system',
      userName: 'Sistema Análisis Precios',
      details: { type: 'CASO_CARTAGENA', severity: 'CRITICAL' },
      timestamp: subtractDays(getCurrentDate(), rng.int(2, 27)),
    });
  }

  // Review (if needed)
  if (status === 'VALIDATED' || status === 'PAID') {
    log.push({
      id: deterministicUUID(`inv-audit-${invoiceId}-review`),
      invoiceId,
      action: 'REVIEWED',
      userId: contabilidadUser.id,
      userName: `${contabilidadUser.firstName} ${contabilidadUser.lastName}`,
      timestamp: subtractDays(getCurrentDate(), rng.int(1, 20)),
    });
  }

  // Approved (if paid)
  if (status === 'PAID') {
    log.push({
      id: deterministicUUID(`inv-audit-${invoiceId}-approve`),
      invoiceId,
      action: 'APPROVED',
      userId: contabilidadUser.id,
      userName: `${contabilidadUser.firstName} ${contabilidadUser.lastName}`,
      timestamp: subtractDays(getCurrentDate(), rng.int(1, 10)),
    });
  }

  return log;
}

/**
 * Generate a single invoice
 */
function generateInvoice(index: number, month: number, isCasoCartagena = false): Invoice {
  const id = deterministicUUID(`invoice-${index}`);
  const purchase = rng.pick(PURCHASES.filter((p) => p.state !== 'REQUISICION'));

  const issueDate = subtractMonths(getCurrentDate(), month - 1);
  const dueDate = addDays(issueDate, 30);
  const uploadedAt = addDays(issueDate, rng.int(1, 5));

  const liced = getLicedVega();

  // Calculate amounts
  const amount = purchase.orderedAmount;
  const taxAmount = amount * 0.19; // IVA 19%
  const totalAmount = amount + taxAmount;

  const invoiceNumber = generateInvoiceNumber(issueDate, index);

  // Generate supplier data
  const supplier = {
    name: purchase.supplierName,
    nit: generateNIT(),
    address: rng.pick(['Calle 50 # 10-20', 'Carrera 15 # 80-30', 'Avenida 68 # 25-40']),
    phone: purchase.supplierPhone,
    email: purchase.supplierEmail,
  };

  // Extract fields via OCR
  const extractedFields = generateExtractedFields(
    invoiceNumber,
    issueDate,
    dueDate,
    supplier,
    amount,
    taxAmount,
    totalAmount,
    purchase.description,
  );

  // Generate price variances (including Caso Cartagena)
  const priceVariances: PriceVariance[] = [];
  const lineMatches = generateInvoiceLineMatches(purchase, isCasoCartagena);

  lineMatches.forEach((match) => {
    if (!match.priceMatch) {
      const material = purchase.materials.find((m: any) => m.id === match.purchaseLineId);
      if (material) {
        priceVariances.push(
          generatePriceVariance(
            material.materialId,
            material.materialName,
            match.purchaseUnitPrice,
            match.invoiceUnitPrice,
            isCasoCartagena,
          ),
        );
      }
    }
  });

  const hasAnomalies = priceVariances.length > 0;
  const anomalySeverity = hasAnomalies
    ? priceVariances.reduce(
        (max, v) =>
          v.anomalySeverity === 'CRIT' ? 'CRIT' : max === 'CRIT' ? 'CRIT' : v.anomalySeverity,
        'MED' as 'MED' | 'HIGH' | 'CRIT',
      )
    : undefined;

  // Validation
  const validationResult = generateValidationResult(hasAnomalies, priceVariances);

  // Status based on anomalies and payment
  let status: InvoiceStatus;
  if (isCasoCartagena || anomalySeverity === 'CRIT') {
    status = 'ANOMALY_DETECTED';
  } else if (validationResult.requiresManualReview) {
    status = 'PENDING_REVIEW';
  } else if (rng.boolean(0.7)) {
    status = 'PAID';
  } else {
    status = 'VALIDATED';
  }

  const matchingStatus = lineMatches.every((m) => m.priceMatch && m.quantityMatch)
    ? 'COMPLETE'
    : lineMatches.some((m) => m.priceMatch || m.quantityMatch)
      ? 'PARTIAL'
      : 'UNMATCHED';

  const paymentStatus = status === 'PAID' ? 'PAID' : 'PENDING';
  const paidAmount = status === 'PAID' ? totalAmount : undefined;
  const paidDate = status === 'PAID' ? addDays(dueDate, rng.int(-10, 10)) : undefined;

  const contabilidadUsers = getUsersByRole('contabilidad');
  const reviewedBy =
    status === 'VALIDATED' ||
    status === 'PAID' ||
    status === 'ANOMALY_DETECTED' ||
    status === 'PENDING_REVIEW'
      ? contabilidadUsers.length > 0
        ? contabilidadUsers[0].id
        : liced.id
      : undefined;
  const reviewedAt = reviewedBy ? subtractDays(getCurrentDate(), rng.int(1, 20)) : undefined;

  const auditLog = generateInvoiceAuditLog(id, status, isCasoCartagena);
  const attachments = generateInvoiceAttachments(id);

  return {
    id,
    purchaseId: purchase.id,
    status,
    documentUrl: `https://storage.contecsa.com/invoices/${id}/original.pdf`,
    uploadedAt,
    uploadedBy: liced.id,
    fileName: `factura_${invoiceNumber}.pdf`,
    fileSize: rng.int(200000, 1500000),
    extractedFields,
    extractionTimestamp: addDays(uploadedAt, 1),
    extractionMethod: rng.pick(['GOOGLE_VISION', 'AWS_TEXTRACT']),
    validationResult,
    validationTimestamp: addDays(uploadedAt, 2),
    invoiceNumber,
    issueDate,
    dueDate,
    amount,
    taxAmount,
    totalAmount,
    currencyCode: 'COP',
    supplierId: purchase.supplierId,
    supplierName: supplier.name,
    supplierTax: supplier.nit,
    buyerName: 'Contecsa S.A.',
    buyerTax: '900123456-7',
    priceVariances,
    hasAnomalies,
    anomalySeverity,
    reviewedBy,
    reviewedAt,
    reviewNotes: isCasoCartagena
      ? 'CRÍTICO: Sobrecobro detectado - Similar a caso Cartagena'
      : undefined,
    rejectionReason: undefined,
    matchedPurchaseLines: lineMatches,
    unmatchedLines: [],
    matchingStatus,
    paymentStatus,
    paidAmount,
    paidDate,
    auditLog,
    attachments,
    createdAt: uploadedAt,
    updatedAt: getCurrentDate(),
  };
}

/**
 * Generate 198 invoices across 3 months (66/month) with OCR and anomaly detection
 * Includes 3 "Caso Cartagena" invoices simulating overbilling scenario
 *
 * @returns Array of 198 Invoice objects with validation and price variance data
 *
 * @example
 * ```ts
 * const invoices = generateInvoices();
 * console.log(invoices.length); // 198
 * const casoCartagena = invoices.filter(i => i.anomalySeverity === 'CRIT');
 * console.log(casoCartagena.length); // 3
 * ```
 */
export function generateInvoices(): Invoice[] {
  const invoices: Invoice[] = [];
  let invoiceIndex = 0;

  // Generate for 3 months
  for (let month = 3; month >= 1; month--) {
    for (let i = 0; i < 66; i++) {
      invoiceIndex++;

      // First 3 invoices are "Caso Cartagena" scenarios
      const isCasoCartagena = invoiceIndex <= 3;

      invoices.push(generateInvoice(invoiceIndex, month, isCasoCartagena));
    }
  }

  return invoices;
}

/**
 * Pre-generated invoices
 */
export const INVOICES = generateInvoices();

/**
 * Get "Caso Cartagena" invoices (overbilling scenario - 3 total)
 * Simulates undetected price overbilling similar to Cartagena case
 *
 * @returns Array of 3 Invoice objects with CRIT anomaly severity
 *
 * @example
 * ```ts
 * const cartagena = getCasoCartagenaInvoices();
 * console.log(cartagena.length); // 3
 * console.log(cartagena[0].status); // "ANOMALY_DETECTED"
 * console.log(cartagena[0].reviewNotes); // "CRÍTICO: Sobrecobro detectado..."
 * ```
 */
export function getCasoCartagenaInvoices(): Invoice[] {
  return INVOICES.filter(
    (inv) => inv.anomalySeverity === 'CRIT' && inv.status === 'ANOMALY_DETECTED',
  ).slice(0, 3);
}

/**
 * Get invoices by processing status
 * Statuses: PENDING_OCR, OCR_EXTRACTED, PENDING_REVIEW, VALIDATED, ANOMALY_DETECTED, PAID, REJECTED
 *
 * @param status - Invoice status, e.g., "ANOMALY_DETECTED"
 * @returns Array of invoices with status, empty if none found
 *
 * @example
 * ```ts
 * const anomalies = getInvoicesByStatus('ANOMALY_DETECTED');
 * console.log(anomalies.length); // Invoices with anomalies
 * ```
 */
export function getInvoicesByStatus(status: InvoiceStatus): Invoice[] {
  return INVOICES.filter((inv) => inv.status === status);
}

/**
 * Get invoices with any price variance anomalies detected
 * Includes all severity levels (MED, HIGH, CRIT) and all statuses
 *
 * @returns Array of invoices with detected price variances
 *
 * @example
 * ```ts
 * const anomalies = getInvoicesWithAnomalies();
 * console.log(anomalies.length); // Invoices with any variance
 * const critical = anomalies.filter(i => i.anomalySeverity === 'CRIT');
 * ```
 */
export function getInvoicesWithAnomalies(): Invoice[] {
  return INVOICES.filter((inv) => inv.hasAnomalies);
}

/**
 * Get all invoices for a specific purchase
 * Purchases can have 1+ invoices (split shipments, etc.)
 *
 * @param purchaseId - Purchase ID (UUID format)
 * @returns Array of invoices for purchase, empty if none found
 *
 * @example
 * ```ts
 * const invoices = getInvoicesByPurchase(purchaseId);
 * console.log(invoices.length); // Usually 1, sometimes multiple
 * ```
 */
export function getInvoicesByPurchase(purchaseId: string): Invoice[] {
  return INVOICES.filter((inv) => inv.purchaseId === purchaseId);
}

/**
 * Get aggregate statistics for all invoices
 * Includes status distribution, anomaly counts, and monthly breakdown
 *
 * @returns Statistics object with total, byStatus, withAnomalies, casoCartagena, byMonth
 *
 * @example
 * ```ts
 * const stats = getInvoiceStats();
 * console.log(stats.total); // 198
 * console.log(stats.byStatus.paid); // ~100+
 * console.log(stats.withAnomalies); // Invoices with variances
 * console.log(stats.casoCartagena); // 3
 * ```
 */
export function getInvoiceStats() {
  return {
    total: INVOICES.length,
    byStatus: {
      pending_ocr: INVOICES.filter((i) => i.status === 'PENDING_OCR').length,
      ocr_extracted: INVOICES.filter((i) => i.status === 'OCR_EXTRACTED').length,
      pending_review: INVOICES.filter((i) => i.status === 'PENDING_REVIEW').length,
      validated: INVOICES.filter((i) => i.status === 'VALIDATED').length,
      anomaly_detected: INVOICES.filter((i) => i.status === 'ANOMALY_DETECTED').length,
      paid: INVOICES.filter((i) => i.status === 'PAID').length,
      rejected: INVOICES.filter((i) => i.status === 'REJECTED').length,
    },
    withAnomalies: INVOICES.filter((i) => i.hasAnomalies).length,
    casoCartagena: getCasoCartagenaInvoices().length,
    byMonth: {
      month1: INVOICES.filter((i) => i.issueDate >= subtractMonths(getCurrentDate(), 1)).length,
      month2: INVOICES.filter(
        (i) =>
          i.issueDate >= subtractMonths(getCurrentDate(), 2) &&
          i.issueDate < subtractMonths(getCurrentDate(), 1),
      ).length,
      month3: INVOICES.filter(
        (i) =>
          i.issueDate >= subtractMonths(getCurrentDate(), 3) &&
          i.issueDate < subtractMonths(getCurrentDate(), 2),
      ).length,
    },
  };
}
