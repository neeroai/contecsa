/**
 * Notification and Alert Types
 * Contecsa Sistema de Inteligencia de Datos
 *
 * Version: 1.0 | Date: 2025-12-24 12:00
 *
 * Defines notifications, alerts, and communication system.
 * Critical for F005 Sistema Notificaciones feature.
 * Integrates with Gmail API (250 req/sec, >99% delivery).
 */

import { z } from 'zod';

/**
 * Notification types across system
 */
export type NotificationType =
  | 'PURCHASE_CREATED'
  | 'PURCHASE_APPROVED'
  | 'PURCHASE_REJECTED'
  | 'PURCHASE_RECEIVED'
  | 'PURCHASE_OVERDUE'
  | 'INVOICE_UPLOADED'
  | 'INVOICE_PROCESSED'
  | 'INVOICE_ANOMALY'
  | 'PRICE_VARIANCE_DETECTED'
  | 'CERTIFICATE_MISSING'
  | 'CERTIFICATE_EXPIRING'
  | 'CERTIFICATE_EXPIRED'
  | 'STOCK_LOW'
  | 'STOCK_CRITICAL'
  | 'STOCK_OVERSTOCK'
  | 'FORECAST_ALERT'
  | 'BUDGET_VARIANCE'
  | 'MAINTENANCE_DUE'
  | 'SYSTEM_ALERT'
  | 'CUSTOM';

export const NotificationTypeEnum = {
  PURCHASE_CREATED: 'PURCHASE_CREATED' as const,
  PURCHASE_APPROVED: 'PURCHASE_APPROVED' as const,
  PURCHASE_REJECTED: 'PURCHASE_REJECTED' as const,
  PURCHASE_RECEIVED: 'PURCHASE_RECEIVED' as const,
  PURCHASE_OVERDUE: 'PURCHASE_OVERDUE' as const,
  INVOICE_UPLOADED: 'INVOICE_UPLOADED' as const,
  INVOICE_PROCESSED: 'INVOICE_PROCESSED' as const,
  INVOICE_ANOMALY: 'INVOICE_ANOMALY' as const,
  PRICE_VARIANCE_DETECTED: 'PRICE_VARIANCE_DETECTED' as const,
  CERTIFICATE_MISSING: 'CERTIFICATE_MISSING' as const,
  CERTIFICATE_EXPIRING: 'CERTIFICATE_EXPIRING' as const,
  CERTIFICATE_EXPIRED: 'CERTIFICATE_EXPIRED' as const,
  STOCK_LOW: 'STOCK_LOW' as const,
  STOCK_CRITICAL: 'STOCK_CRITICAL' as const,
  STOCK_OVERSTOCK: 'STOCK_OVERSTOCK' as const,
  FORECAST_ALERT: 'FORECAST_ALERT' as const,
  BUDGET_VARIANCE: 'BUDGET_VARIANCE' as const,
  MAINTENANCE_DUE: 'MAINTENANCE_DUE' as const,
  SYSTEM_ALERT: 'SYSTEM_ALERT' as const,
  CUSTOM: 'CUSTOM' as const,
} as const;

/**
 * Alert priority levels
 */
export type AlertPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export const AlertPriorityEnum = {
  LOW: 'LOW' as const,
  MEDIUM: 'MEDIUM' as const,
  HIGH: 'HIGH' as const,
  CRITICAL: 'CRITICAL' as const,
} as const;

/**
 * Alert type for categorization
 */
export type AlertType =
  | 'WORKFLOW'
  | 'FINANCIAL'
  | 'INVENTORY'
  | 'COMPLIANCE'
  | 'OPERATIONAL'
  | 'SYSTEM';

export const AlertTypeEnum = {
  WORKFLOW: 'WORKFLOW' as const,
  FINANCIAL: 'FINANCIAL' as const,
  INVENTORY: 'INVENTORY' as const,
  COMPLIANCE: 'COMPLIANCE' as const,
  OPERATIONAL: 'OPERATIONAL' as const,
  SYSTEM: 'SYSTEM' as const,
} as const;

/**
 * Notification channel for delivery
 */
export type NotificationChannel = 'EMAIL' | 'IN_APP' | 'SMS' | 'PUSH' | 'WEBHOOK';

export const NotificationChannelEnum = {
  EMAIL: 'EMAIL' as const,
  IN_APP: 'IN_APP' as const,
  SMS: 'SMS' as const,
  PUSH: 'PUSH' as const,
  WEBHOOK: 'WEBHOOK' as const,
} as const;

/**
 * Delivery status
 */
export type DeliveryStatus = 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'BOUNCED';

export const DeliveryStatusEnum = {
  QUEUED: 'QUEUED' as const,
  SENT: 'SENT' as const,
  DELIVERED: 'DELIVERED' as const,
  READ: 'READ' as const,
  FAILED: 'FAILED' as const,
  BOUNCED: 'BOUNCED' as const,
} as const;

/**
 * Notification metadata and context
 */
export interface NotificationMetadata {
  readonly entityType?: string;
  readonly entityId?: string;
  readonly relatedId?: string;
  readonly contextData?: Record<string, unknown>;
  readonly actionUrl?: string;
  readonly actionLabel?: string;
}

/**
 * Delivery attempt record
 */
export interface DeliveryAttempt {
  readonly id: string;
  readonly notificationId: string;
  readonly channel: NotificationChannel;
  readonly attemptNumber: number;
  readonly status: DeliveryStatus;
  readonly sentAt: Date;
  readonly deliveredAt?: Date;
  readonly readAt?: Date;
  readonly errorMessage?: string;
  readonly errorCode?: string;
  readonly provider?: string; // Gmail, Twilio, etc.
  readonly providerMessageId?: string;
}

/**
 * Notification rule for automated routing
 */
export interface NotificationRule {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly notificationType: NotificationType;
  readonly triggerCondition: Record<string, unknown>;
  readonly targetUsers: NotificationTarget[];
  readonly channels: NotificationChannel[];
  readonly priority: AlertPriority;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Target recipient for notification
 */
export interface NotificationTarget {
  readonly userId?: string;
  readonly email?: string;
  readonly role?: string;
  readonly department?: string;
  readonly group?: string;
  readonly manager?: boolean; // send to manager if true
}

/**
 * Main notification model
 */
export interface Notification {
  readonly id: string;
  readonly notificationType: NotificationType;
  readonly alertType: AlertType;
  readonly priority: AlertPriority;

  // Content
  readonly title: string;
  readonly message: string;
  readonly description?: string;
  readonly htmlContent?: string;

  // Recipients
  readonly recipientUserId: string;
  readonly recipientEmail: string;
  readonly recipientRole: string;
  readonly recipientName?: string;

  // Metadata
  readonly metadata: NotificationMetadata;
  readonly tags: string[];

  // Delivery tracking
  readonly channels: NotificationChannel[];
  readonly deliveryAttempts: DeliveryAttempt[];
  readonly primaryDeliveryStatus: DeliveryStatus;
  readonly retryCount: number;
  readonly maxRetries: number;

  // Status
  readonly isRead: boolean;
  readonly isArchived: boolean;
  readonly isDismissed: boolean;

  // Timestamps
  readonly createdAt: Date;
  readonly scheduledAt?: Date;
  readonly sentAt?: Date;
  readonly readAt?: Date;
  readonly expiresAt?: Date;

  // Related records
  readonly relatedPurchaseId?: string;
  readonly relatedInvoiceId?: string;
  readonly relatedMaterialId?: string;
  readonly relatedProjectId?: string;
}

/**
 * Notification template for reusable messages
 */
export interface NotificationTemplate {
  readonly id: string;
  readonly name: string;
  readonly notificationType: NotificationType;
  readonly titleTemplate: string;
  readonly messageTemplate: string;
  readonly htmlTemplate?: string;
  readonly variables: string[]; // variables like {{poNumber}}, {{amount}}
  readonly defaultChannels: NotificationChannel[];
  readonly defaultPriority: AlertPriority;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Notification digest for batch processing
 */
export interface NotificationDigest {
  readonly id: string;
  readonly userId: string;
  readonly recipientEmail: string;
  readonly period: 'DAILY' | 'WEEKLY';
  readonly notifications: Notification[];
  readonly notificationCount: number;
  readonly unreadCount: number;
  readonly digestDate: Date;
  readonly sentAt?: Date;
}

/**
 * Notification statistics
 */
export interface NotificationStats {
  readonly periodStart: Date;
  readonly periodEnd: Date;
  readonly totalNotifications: number;
  readonly totalDelivered: number;
  readonly totalFailed: number;
  readonly totalRead: number;
  readonly deliveryRate: number; // percentage
  readonly averageDeliveryTime: number; // milliseconds
  readonly byType: Record<string, number>;
  readonly byChannel: Record<string, number>;
  readonly byPriority: Record<AlertPriority, number>;
}

/**
 * Zod Schema: Notification Type validation
 */
export const NotificationTypeSchema = z.enum([
  'PURCHASE_CREATED',
  'PURCHASE_APPROVED',
  'PURCHASE_REJECTED',
  'PURCHASE_RECEIVED',
  'PURCHASE_OVERDUE',
  'INVOICE_UPLOADED',
  'INVOICE_PROCESSED',
  'INVOICE_ANOMALY',
  'PRICE_VARIANCE_DETECTED',
  'CERTIFICATE_MISSING',
  'CERTIFICATE_EXPIRING',
  'CERTIFICATE_EXPIRED',
  'STOCK_LOW',
  'STOCK_CRITICAL',
  'STOCK_OVERSTOCK',
  'FORECAST_ALERT',
  'BUDGET_VARIANCE',
  'MAINTENANCE_DUE',
  'SYSTEM_ALERT',
  'CUSTOM',
]);

/**
 * Zod Schema: Alert Priority validation
 */
export const AlertPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

/**
 * Zod Schema: Alert Type validation
 */
export const AlertTypeSchema = z.enum(['WORKFLOW', 'FINANCIAL', 'INVENTORY', 'COMPLIANCE', 'OPERATIONAL', 'SYSTEM']);

/**
 * Zod Schema: Notification Channel validation
 */
export const NotificationChannelSchema = z.enum(['EMAIL', 'IN_APP', 'SMS', 'PUSH', 'WEBHOOK']);

/**
 * Zod Schema: Delivery Status validation
 */
export const DeliveryStatusSchema = z.enum(['QUEUED', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'BOUNCED']);

/**
 * Zod Schema: Notification Metadata validation
 */
export const NotificationMetadataSchema = z.object({
  entityType: z.string().optional(),
  entityId: z.string().uuid().optional(),
  relatedId: z.string().uuid().optional(),
  contextData: z.record(z.unknown()).optional(),
  actionUrl: z.string().url().optional(),
  actionLabel: z.string().optional(),
});

/**
 * Zod Schema: Delivery Attempt validation
 */
export const DeliveryAttemptSchema = z.object({
  id: z.string().uuid(),
  notificationId: z.string().uuid(),
  channel: NotificationChannelSchema,
  attemptNumber: z.number().positive(),
  status: DeliveryStatusSchema,
  sentAt: z.date(),
  deliveredAt: z.date().optional(),
  readAt: z.date().optional(),
  errorMessage: z.string().optional(),
  errorCode: z.string().optional(),
  provider: z.string().optional(),
  providerMessageId: z.string().optional(),
});

/**
 * Zod Schema: Notification Target validation
 */
export const NotificationTargetSchema = z.object({
  userId: z.string().uuid().optional(),
  email: z.string().email().optional(),
  role: z.string().optional(),
  department: z.string().optional(),
  group: z.string().optional(),
  manager: z.boolean().optional(),
});

/**
 * Zod Schema: Notification validation
 */
export const NotificationSchema = z.object({
  id: z.string().uuid(),
  notificationType: NotificationTypeSchema,
  alertType: AlertTypeSchema,
  priority: AlertPrioritySchema,
  title: z.string().min(1),
  message: z.string().min(1),
  description: z.string().optional(),
  htmlContent: z.string().optional(),
  recipientUserId: z.string().uuid(),
  recipientEmail: z.string().email(),
  recipientRole: z.string().min(1),
  recipientName: z.string().optional(),
  metadata: NotificationMetadataSchema,
  tags: z.array(z.string()),
  channels: z.array(NotificationChannelSchema),
  deliveryAttempts: z.array(DeliveryAttemptSchema),
  primaryDeliveryStatus: DeliveryStatusSchema,
  retryCount: z.number().nonnegative(),
  maxRetries: z.number().nonnegative(),
  isRead: z.boolean(),
  isArchived: z.boolean(),
  isDismissed: z.boolean(),
  createdAt: z.date(),
  scheduledAt: z.date().optional(),
  sentAt: z.date().optional(),
  readAt: z.date().optional(),
  expiresAt: z.date().optional(),
  relatedPurchaseId: z.string().uuid().optional(),
  relatedInvoiceId: z.string().uuid().optional(),
  relatedMaterialId: z.string().uuid().optional(),
  relatedProjectId: z.string().uuid().optional(),
});

/**
 * Type inference from Zod schemas
 */
export type NotificationType_Inferred = z.infer<typeof NotificationSchema>;
export type DeliveryAttemptType = z.infer<typeof DeliveryAttemptSchema>;
export type NotificationMetadataType = z.infer<typeof NotificationMetadataSchema>;
export type NotificationTargetType = z.infer<typeof NotificationTargetSchema>;
