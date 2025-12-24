/**
 * Project and Consortium Types
 * Contecsa Sistema de Inteligencia de Datos
 *
 * Version: 1.0 | Date: 2025-12-24 12:00
 *
 * Defines projects, consortium structures, budgets, and EVM metrics.
 * Critical for F010 Proyección Financiera and F014 Seguimiento EVM.
 * 9 consorcios tracked: PAVICONSTRUJC, EDUBAR-KRA50, PTAR, etc.
 */

import { z } from 'zod';

/**
 * Project status
 */
export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'CLOSED';

export const ProjectStatusEnum = {
  PLANNING: 'PLANNING' as const,
  ACTIVE: 'ACTIVE' as const,
  SUSPENDED: 'SUSPENDED' as const,
  COMPLETED: 'COMPLETED' as const,
  CLOSED: 'CLOSED' as const,
} as const;

/**
 * EVM (Earned Value Management) metrics
 * CPI = Earned Value / Actual Cost
 * SPI = Earned Value / Planned Value
 */
export interface EVMMetrics {
  readonly plannedValue: number; // PV - budgeted cost of scheduled work
  readonly earnedValue: number; // EV - budgeted cost of actual work
  readonly actualCost: number; // AC - actual cost of work performed
  readonly cpi: number; // CPI = EV/AC (cost performance index)
  readonly spi: number; // SPI = EV/PV (schedule performance index)
  readonly eac: number; // EAC - estimate at completion
  readonly etc: number; // ETC - estimate to complete
  readonly vac: number; // VAC - variance at completion
  readonly cv: number; // CV - cost variance (EV - AC)
  readonly sv: number; // SV - schedule variance (EV - PV)
  readonly calculatedAt: Date;
}

/**
 * Budget line item
 */
export interface BudgetLine {
  readonly id: string;
  readonly category: string;
  readonly description: string;
  readonly plannedAmount: number;
  readonly executedAmount: number;
  readonly remainingAmount: number;
  readonly variance: number; // percentage
  readonly lastUpdated: Date;
}

/**
 * Budget tracking
 */
export interface Budget {
  readonly id: string;
  readonly projectId: string;
  readonly totalBudget: number;
  readonly approvedBudget: number;
  readonly executedBudget: number;
  readonly committedBudget: number;
  readonly availableBudget: number;
  readonly budgetLines: BudgetLine[];
  readonly budgetUtilization: number; // percentage
  readonly lastUpdated: Date;
}

/**
 * Forecast data for future periods
 */
export interface Forecast {
  readonly period: string; // YYYY-MM
  readonly forecastedExpenses: number;
  readonly confidence: number; // 0-100
  readonly projectedCashFlow: number;
  readonly riskAdjustment?: number;
  readonly notes?: string;
}

/**
 * Consortium (Consorcio) - shared projects between multiple organizations
 */
export interface Consortium {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly description?: string;
  readonly members: ConsortiumMember[];
  readonly status: ProjectStatus;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly location: string;
  readonly clientName: string;
  readonly contractValue: number;
  readonly projectCount: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Consortium member organization
 */
export interface ConsortiumMember {
  readonly id: string;
  readonly consortiumId: string;
  readonly organizationName: string;
  readonly participationPercentage: number;
  readonly contactPerson: string;
  readonly email: string;
  readonly phone: string;
  readonly joinedDate: Date;
}

/**
 * Project model - complete project definition
 * Represents individual projects under consortiums
 */
export interface Project {
  readonly id: string;
  readonly consortiumId: string;
  readonly consortiumName: string;
  readonly name: string;
  readonly code: string;
  readonly status: ProjectStatus;

  // Schedule
  readonly startDate: Date;
  readonly endDate: Date;
  readonly projectedEndDate?: Date;
  readonly actualEndDate?: Date;
  readonly durationDays: number;
  readonly completionPercentage: number;

  // Location
  readonly location: string;
  readonly address: string;
  readonly city: string;
  readonly country: string;

  // Financial
  readonly budget: Budget;
  readonly estimatedValue: number;
  readonly actualValue: number;

  // Forecasting
  readonly forecasts: Forecast[];
  readonly nextForecastPeriod: string;

  // EVM metrics
  readonly evmMetrics: EVMMetrics;
  readonly scheduleHealth: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';
  readonly budgetHealth: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';

  // Team
  readonly projectManager: string;
  readonly projectManagerId: string;
  readonly technicalLead?: string;
  readonly technicalLeadId?: string;
  readonly teamSize: number;

  // Materials and consumption
  readonly materialCategories: string[];
  readonly estimatedMaterialCost: number;
  readonly actualMaterialCost: number;

  // Risk management
  readonly riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly riskDescription?: string;

  // Metadata
  readonly description?: string;
  readonly tags: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdBy: string;
}

/**
 * Monthly project summary for dashboards
 */
export interface ProjectMonthlySummary {
  readonly projectId: string;
  readonly period: string; // YYYY-MM
  readonly plannedValue: number;
  readonly earnedValue: number;
  readonly actualCost: number;
  readonly materialsCost: number;
  readonly laborCost: number;
  readonly miscCost: number;
  readonly invoiceCount: number;
  readonly purchaseCount: number;
}

/**
 * Project filter for searches
 */
export interface ProjectFilter {
  readonly status?: ProjectStatus;
  readonly consortiumId?: string;
  readonly search?: string;
  readonly startDateFrom?: Date;
  readonly startDateTo?: Date;
  readonly endDateFrom?: Date;
  readonly endDateTo?: Date;
  readonly budgetMin?: number;
  readonly budgetMax?: number;
}

/**
 * Zod Schema: Project Status validation
 */
export const ProjectStatusSchema = z.enum([
  'PLANNING',
  'ACTIVE',
  'SUSPENDED',
  'COMPLETED',
  'CLOSED',
]);

/**
 * Zod Schema: Budget Line validation
 */
export const BudgetLineSchema = z.object({
  id: z.string().uuid(),
  category: z.string().min(1),
  description: z.string().min(1),
  plannedAmount: z.number().nonnegative(),
  executedAmount: z.number().nonnegative(),
  remainingAmount: z.number().nonnegative(),
  variance: z.number(),
  lastUpdated: z.date(),
});

/**
 * Zod Schema: Budget validation
 */
export const BudgetSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  totalBudget: z.number().nonnegative(),
  approvedBudget: z.number().nonnegative(),
  executedBudget: z.number().nonnegative(),
  committedBudget: z.number().nonnegative(),
  availableBudget: z.number().nonnegative(),
  budgetLines: z.array(BudgetLineSchema),
  budgetUtilization: z.number().min(0).max(100),
  lastUpdated: z.date(),
});

/**
 * Zod Schema: EVM Metrics validation
 */
export const EVMMetricsSchema = z.object({
  plannedValue: z.number().nonnegative(),
  earnedValue: z.number().nonnegative(),
  actualCost: z.number().nonnegative(),
  cpi: z.number().positive(),
  spi: z.number().positive(),
  eac: z.number().nonnegative(),
  etc: z.number().nonnegative(),
  vac: z.number(),
  cv: z.number(),
  sv: z.number(),
  calculatedAt: z.date(),
});

/**
 * Zod Schema: Forecast validation
 */
export const ForecastSchema = z.object({
  period: z.string().regex(/^\d{4}-\d{2}$/),
  forecastedExpenses: z.number().nonnegative(),
  confidence: z.number().min(0).max(100),
  projectedCashFlow: z.number(),
  riskAdjustment: z.number().optional(),
  notes: z.string().optional(),
});

/**
 * Zod Schema: Consortium Member validation
 */
export const ConsortiumMemberSchema = z.object({
  id: z.string().uuid(),
  consortiumId: z.string().uuid(),
  organizationName: z.string().min(1),
  participationPercentage: z.number().min(0).max(100),
  contactPerson: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  joinedDate: z.date(),
});

/**
 * Zod Schema: Consortium validation
 */
export const ConsortiumSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional(),
  members: z.array(ConsortiumMemberSchema),
  status: ProjectStatusSchema,
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().min(1),
  clientName: z.string().min(1),
  contractValue: z.number().nonnegative(),
  projectCount: z.number().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Zod Schema: Project validation
 */
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  consortiumId: z.string().uuid(),
  consortiumName: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  status: ProjectStatusSchema,
  startDate: z.date(),
  endDate: z.date(),
  projectedEndDate: z.date().optional(),
  actualEndDate: z.date().optional(),
  durationDays: z.number().positive(),
  completionPercentage: z.number().min(0).max(100),
  location: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  budget: BudgetSchema,
  estimatedValue: z.number().nonnegative(),
  actualValue: z.number().nonnegative(),
  forecasts: z.array(ForecastSchema),
  nextForecastPeriod: z.string().regex(/^\d{4}-\d{2}$/),
  evmMetrics: EVMMetricsSchema,
  scheduleHealth: z.enum(['ON_TRACK', 'AT_RISK', 'OFF_TRACK']),
  budgetHealth: z.enum(['ON_TRACK', 'AT_RISK', 'OFF_TRACK']),
  projectManager: z.string().min(1),
  projectManagerId: z.string().uuid(),
  technicalLead: z.string().optional(),
  technicalLeadId: z.string().uuid().optional(),
  teamSize: z.number().positive(),
  materialCategories: z.array(z.string()),
  estimatedMaterialCost: z.number().nonnegative(),
  actualMaterialCost: z.number().nonnegative(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  riskDescription: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid(),
});

/**
 * Zod Schema: Project Monthly Summary validation
 */
export const ProjectMonthlySummarySchema = z.object({
  projectId: z.string().uuid(),
  period: z.string().regex(/^\d{4}-\d{2}$/),
  plannedValue: z.number().nonnegative(),
  earnedValue: z.number().nonnegative(),
  actualCost: z.number().nonnegative(),
  materialsCost: z.number().nonnegative(),
  laborCost: z.number().nonnegative(),
  miscCost: z.number().nonnegative(),
  invoiceCount: z.number().nonnegative(),
  purchaseCount: z.number().nonnegative(),
});

/**
 * Zod Schema: Project Filter validation
 */
export const ProjectFilterSchema = z.object({
  status: ProjectStatusSchema.optional(),
  consortiumId: z.string().uuid().optional(),
  search: z.string().optional(),
  startDateFrom: z.date().optional(),
  startDateTo: z.date().optional(),
  endDateFrom: z.date().optional(),
  endDateTo: z.date().optional(),
  budgetMin: z.number().nonnegative().optional(),
  budgetMax: z.number().nonnegative().optional(),
});

/**
 * Type inference from Zod schemas
 */
export type ProjectType = z.infer<typeof ProjectSchema>;
export type BudgetType = z.infer<typeof BudgetSchema>;
export type BudgetLineType = z.infer<typeof BudgetLineSchema>;
export type EVMMetricsType = z.infer<typeof EVMMetricsSchema>;
export type ForecastType = z.infer<typeof ForecastSchema>;
export type ConsortiumType = z.infer<typeof ConsortiumSchema>;
export type ConsortiumMemberType = z.infer<typeof ConsortiumMemberSchema>;
export type ProjectMonthlySummaryType = z.infer<typeof ProjectMonthlySummarySchema>;
export type ProjectFilterType = z.infer<typeof ProjectFilterSchema>;
