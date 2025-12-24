/**
 * Purchases Data Generator
 * Contecsa Sistema de Inteligencia de Datos
 *
 * Version: 1.0 | Date: 2025-12-24 13:00
 *
 * Generates 55 purchases matching Excel baseline.
 * Distribution: 7 REQUISICION, 9 APROBACION, 12 ORDEN, 8 CONFIRMACION,
 *               6 RECEPCION, 5 CERTIFICADOS, 8 CERRADO
 * 15 purchases >30d (at-risk), 3 purchases >45d (critical)
 */

import type {
  AlertFlag,
  Attachment,
  AuditLogEntry,
  Purchase,
  PurchaseMaterial,
  PurchaseNote,
  PurchaseState,
  StatusColor,
} from '../types';
import { getRandomProject } from './consorcios';
import { getRandomMaterial } from './materials';
import { getRandomSupplier } from './suppliers';
import { getLicedVega, getUsersByRole } from './users';
import { deterministicUUID, generatePONumber, getCurrentDate, rng, subtractDays } from './utils';

/**
 * State distribution for 55 purchases
 */
const STATE_DISTRIBUTION: Record<PurchaseState, number> = {
  REQUISICION: 7,
  APROBACION: 9,
  ORDEN: 12,
  CONFIRMACION: 8,
  RECEPCION: 6,
  CERTIFICADOS: 5,
  CERRADO: 8,
};

/**
 * Generate purchase materials
 */
function generatePurchaseMaterials(count: number): PurchaseMaterial[] {
  const materials: PurchaseMaterial[] = [];

  for (let i = 0; i < count; i++) {
    const material = getRandomMaterial();
    const quantity = rng.int(10, 500);
    const unitPrice = material.currentPrice * rng.float(0.95, 1.05);
    const totalPrice = quantity * unitPrice;
    const receivedQuantity = rng.boolean(0.7) ? quantity : rng.int(0, quantity);
    const qualityApproved = receivedQuantity === quantity && rng.boolean(0.9);

    materials.push({
      id: deterministicUUID(`purchase-material-${i}-${material.code}`),
      materialId: material.id,
      materialCode: material.code,
      materialName: material.name,
      category: material.category,
      quantity,
      unit: material.unit,
      unitPrice,
      totalPrice,
      receivedQuantity,
      qualityApproved,
    });
  }

  return materials;
}

/**
 * Generate audit log for purchase
 */
function generateAuditLog(
  purchaseId: string,
  state: PurchaseState,
  createdAt: Date,
  daysInProcess: number,
): AuditLogEntry[] {
  const log: AuditLogEntry[] = [];
  const liced = getLicedVega();
  const gerenciaUsers = getUsersByRole('gerencia');
  const almacenUsers = getUsersByRole('almacen');

  // Creation
  log.push({
    id: deterministicUUID(`audit-${purchaseId}-created`),
    purchaseId,
    action: 'STATE_CHANGE',
    previousState: undefined,
    newState: 'REQUISICION',
    userId: liced.id,
    userName: `${liced.firstName} ${liced.lastName}`,
    userRole: liced.role,
    comment: 'Requisición creada',
    timestamp: createdAt,
  });

  // State transitions based on current state
  const stateOrder: PurchaseState[] = [
    'REQUISICION',
    'APROBACION',
    'ORDEN',
    'CONFIRMACION',
    'RECEPCION',
    'CERTIFICADOS',
    'CERRADO',
  ];

  const currentStateIndex = stateOrder.indexOf(state);

  for (let i = 1; i <= currentStateIndex; i++) {
    const transitionDate = subtractDays(
      getCurrentDate(),
      daysInProcess - i * (daysInProcess / (currentStateIndex + 1)),
    );
    const user = i === 1 ? rng.pick(gerenciaUsers) : i >= 4 ? rng.pick(almacenUsers) : liced;

    log.push({
      id: deterministicUUID(`audit-${purchaseId}-${i}`),
      purchaseId,
      action: 'STATE_CHANGE',
      previousState: stateOrder[i - 1],
      newState: stateOrder[i],
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      comment: `Transición a ${stateOrder[i]}`,
      timestamp: transitionDate,
    });
  }

  return log;
}

/**
 * Generate attachments
 */
function generateAttachments(purchaseId: string, state: PurchaseState): Attachment[] {
  const attachments: Attachment[] = [];
  const liced = getLicedVega();

  // Always have requisition
  attachments.push({
    id: deterministicUUID(`attachment-${purchaseId}-req`),
    fileName: 'requisicion.pdf',
    fileType: 'application/pdf',
    fileSize: rng.int(50000, 500000),
    fileUrl: `https://storage.contecsa.com/purchases/${purchaseId}/requisicion.pdf`,
    uploadedBy: liced.id,
    uploadedAt: subtractDays(getCurrentDate(), rng.int(10, 90)),
    documentType: 'SPECIFICATION',
  });

  // Add invoice if CERRADO
  if (state === 'CERRADO') {
    attachments.push({
      id: deterministicUUID(`attachment-${purchaseId}-inv`),
      fileName: 'factura.pdf',
      fileType: 'application/pdf',
      fileSize: rng.int(100000, 1000000),
      fileUrl: `https://storage.contecsa.com/purchases/${purchaseId}/factura.pdf`,
      uploadedBy: liced.id,
      uploadedAt: subtractDays(getCurrentDate(), rng.int(1, 30)),
      documentType: 'INVOICE',
    });
  }

  // Add certificate if CERTIFICADOS or CERRADO
  if (state === 'CERTIFICADOS' || state === 'CERRADO') {
    attachments.push({
      id: deterministicUUID(`attachment-${purchaseId}-cert`),
      fileName: 'certificado_calidad.pdf',
      fileType: 'application/pdf',
      fileSize: rng.int(50000, 300000),
      fileUrl: `https://storage.contecsa.com/purchases/${purchaseId}/certificado.pdf`,
      uploadedBy: liced.id,
      uploadedAt: subtractDays(getCurrentDate(), rng.int(1, 15)),
      documentType: 'CERTIFICATE',
    });
  }

  return attachments;
}

/**
 * Generate notes
 */
function generateNotes(purchaseId: string, daysInProcess: number): PurchaseNote[] {
  if (daysInProcess < 20) return [];

  const notes: PurchaseNote[] = [];
  const liced = getLicedVega();

  if (daysInProcess > 30) {
    notes.push({
      id: deterministicUUID(`note-${purchaseId}-1`),
      content: 'Compra retrasada, requiere seguimiento urgente',
      author: liced.id,
      authorRole: liced.role,
      createdAt: subtractDays(getCurrentDate(), 5),
      isPublic: true,
    });
  }

  if (daysInProcess > 45) {
    notes.push({
      id: deterministicUUID(`note-${purchaseId}-2`),
      content: 'CRÍTICO: Más de 45 días en proceso. Escalar a gerencia.',
      author: liced.id,
      authorRole: liced.role,
      createdAt: subtractDays(getCurrentDate(), 1),
      isPublic: true,
    });
  }

  return notes;
}

/**
 * Generate alert flags
 */
function generateAlertFlags(
  purchaseId: string,
  daysInProcess: number,
  budgetVariance: number,
  state: PurchaseState,
): AlertFlag[] {
  const flags: AlertFlag[] = [];

  // Overdue alerts
  if (daysInProcess > 30) {
    flags.push({
      id: deterministicUUID(`alert-${purchaseId}-overdue`),
      type: 'OVERDUE',
      severity: daysInProcess > 45 ? 'CRITICAL' : 'HIGH',
      message: `Compra lleva ${daysInProcess} días en proceso`,
      createdAt: subtractDays(getCurrentDate(), 5),
    });
  }

  // Budget exceeded
  if (budgetVariance > 10) {
    flags.push({
      id: deterministicUUID(`alert-${purchaseId}-budget`),
      type: 'BUDGET_EXCEEDED',
      severity: budgetVariance > 20 ? 'CRITICAL' : 'MEDIUM',
      message: `Presupuesto excedido en ${budgetVariance.toFixed(1)}%`,
      createdAt: subtractDays(getCurrentDate(), 3),
    });
  }

  // Missing certificates
  if (state === 'CERTIFICADOS') {
    flags.push({
      id: deterministicUUID(`alert-${purchaseId}-cert`),
      type: 'MISSING_CERTIFICATE',
      severity: 'HIGH',
      message: 'Esperando certificados HSE para continuar',
      createdAt: subtractDays(getCurrentDate(), rng.int(1, 10)),
    });
  }

  return flags;
}

/**
 * Calculate status color based on days in process
 */
function calculateStatusColor(daysInProcess: number): StatusColor {
  if (daysInProcess > 30) return 'red';
  if (daysInProcess > 15) return 'yellow';
  return 'green';
}

/**
 * Generate a single purchase
 */
function generatePurchase(index: number, state: PurchaseState, daysInProcess: number): Purchase {
  const id = deterministicUUID(`purchase-${index}`);
  const createdAt = subtractDays(getCurrentDate(), daysInProcess);
  const project = getRandomProject();
  const supplier = getRandomSupplier();
  const materials = generatePurchaseMaterials(rng.int(1, 3));
  const liced = getLicedVega();
  const gerenciaUsers = getUsersByRole('gerencia');

  const totalQuantity = materials.reduce((sum, m) => sum + m.quantity, 0);
  const orderedAmount = materials.reduce((sum, m) => sum + m.totalPrice, 0);
  const budgetedAmount = orderedAmount * rng.float(0.95, 1.15);
  const receivedAmount = materials.reduce((sum, m) => sum + m.receivedQuantity * m.unitPrice, 0);
  const budgetVariance = ((orderedAmount - budgetedAmount) / budgetedAmount) * 100;

  const expectedDeliveryDate = subtractDays(getCurrentDate(), daysInProcess - rng.int(7, 21));
  const actualDeliveryDate =
    state === 'CERRADO' ? subtractDays(getCurrentDate(), rng.int(1, 7)) : undefined;

  const approvedBy = state !== 'REQUISICION' ? rng.pick(gerenciaUsers).id : undefined;
  const receivedBy =
    state === 'RECEPCION' || state === 'CERTIFICADOS' || state === 'CERRADO'
      ? rng.pick(getUsersByRole('almacen')).id
      : undefined;

  const auditLog = generateAuditLog(id, state, createdAt, daysInProcess);
  const attachments = generateAttachments(id, state);
  const notes = generateNotes(id, daysInProcess);
  const alertFlags = generateAlertFlags(id, daysInProcess, budgetVariance, state);
  const statusColor = calculateStatusColor(daysInProcess);

  return {
    id,
    poNumber: generatePONumber(createdAt, index),
    requisitionId: deterministicUUID(`req-${index}`),
    projectId: project.id,
    consortiumName: project.consortiumName,
    state,
    statusColor,
    daysInProcess,
    createdAt,
    updatedAt: getCurrentDate(),
    expectedDeliveryDate,
    actualDeliveryDate,
    supplierId: supplier.id,
    supplierName: supplier.name,
    supplierContact: supplier.contactPerson,
    supplierEmail: supplier.email,
    supplierPhone: supplier.phone,
    materials,
    totalQuantity,
    description: materials.map((m) => m.materialName).join(', '),
    budgetedAmount,
    orderedAmount,
    receivedAmount,
    budgetVariance,
    currencyCode: 'COP',
    requestedBy: liced.id,
    approvedBy,
    receivedBy,
    createdByUserId: liced.id,
    auditLog,
    attachments,
    notes,
    isOverdue: daysInProcess > 30,
    alertFlags,
  };
}

/**
 * Generate all 55 purchases
 */
export function generatePurchases(): Purchase[] {
  const purchases: Purchase[] = [];
  let purchaseIndex = 0;

  // Generate purchases for each state according to distribution
  for (const [state, count] of Object.entries(STATE_DISTRIBUTION)) {
    for (let i = 0; i < count; i++) {
      purchaseIndex++;

      // Determine days in process
      let daysInProcess: number;

      // Create overdue purchases (15 total: 12 between 30-45d, 3 >45d)
      if (purchaseIndex <= 3) {
        // 3 critical (>45 days)
        daysInProcess = rng.int(46, 60);
      } else if (purchaseIndex <= 15) {
        // 12 at-risk (30-45 days)
        daysInProcess = rng.int(31, 45);
      } else {
        // Rest normal (<30 days)
        daysInProcess = rng.int(1, 29);
      }

      purchases.push(generatePurchase(purchaseIndex, state as PurchaseState, daysInProcess));
    }
  }

  // Shuffle to make it realistic
  return rng.shuffle(purchases);
}

/**
 * Pre-generated purchases
 */
export const PURCHASES = generatePurchases();

/**
 * Helper: Get purchases by state
 */
export function getPurchasesByState(state: PurchaseState): Purchase[] {
  return PURCHASES.filter((p) => p.state === state);
}

/**
 * Helper: Get overdue purchases
 */
export function getOverduePurchases(): Purchase[] {
  return PURCHASES.filter((p) => p.isOverdue);
}

/**
 * Helper: Get purchases by project
 */
export function getPurchasesByProject(projectId: string): Purchase[] {
  return PURCHASES.filter((p) => p.projectId === projectId);
}

/**
 * Helper: Get purchases by status color
 */
export function getPurchasesByColor(color: StatusColor): Purchase[] {
  return PURCHASES.filter((p) => p.statusColor === color);
}

/**
 * Helper: Get purchases statistics
 */
export function getPurchasesStats() {
  return {
    total: PURCHASES.length,
    byState: Object.fromEntries(
      Object.keys(STATE_DISTRIBUTION).map((state) => [
        state,
        PURCHASES.filter((p) => p.state === state).length,
      ]),
    ),
    overdue: PURCHASES.filter((p) => p.isOverdue).length,
    critical: PURCHASES.filter((p) => p.daysInProcess > 45).length,
    atRisk: PURCHASES.filter((p) => p.daysInProcess > 30 && p.daysInProcess <= 45).length,
    byColor: {
      green: PURCHASES.filter((p) => p.statusColor === 'green').length,
      yellow: PURCHASES.filter((p) => p.statusColor === 'yellow').length,
      red: PURCHASES.filter((p) => p.statusColor === 'red').length,
    },
  };
}
