/**
 * @file Inventory and Stock Management Types
 * @description Tipos para control de inventario, niveles de stock y movimientos de materiales
 * @module lib/mockup-data/types/inventory
 * @exports MovementType, MovementTypeEnum, WarehouseLocation, StockLevel, MaterialMovement, InventoryCount, InventoryCountLine, ConsumptionForecast, Inventory, InventoryAlert, InventorySummary, MovementTypeSchema, WarehouseLocationSchema, StockLevelSchema, MaterialMovementSchema, InventoryCountLineSchema, InventoryCountSchema, ConsumptionForecastSchema, InventoryAlertSchema, InventorySchema, InventorySummarySchema
 */

import { z } from 'zod';

/**
 * Inventory movement types
 */
export type MovementType = 'RECEPTION' | 'DELIVERY' | 'ADJUSTMENT' | 'CONSUMPTION' | 'RETURN';

export const MovementTypeEnum = {
  RECEPTION: 'RECEPTION' as const,
  DELIVERY: 'DELIVERY' as const,
  ADJUSTMENT: 'ADJUSTMENT' as const,
  CONSUMPTION: 'CONSUMPTION' as const,
  RETURN: 'RETURN' as const,
} as const;

/**
 * Inventory location/warehouse
 */
export interface WarehouseLocation {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly address: string;
  readonly capacity: number;
  readonly currentUtilization: number;
  readonly manager: string;
  readonly type: 'PRIMARY' | 'SECONDARY' | 'SITE';
}

/**
 * Stock level at specific location
 */
export interface StockLevel {
  readonly id: string;
  readonly materialId: string;
  readonly warehouseId: string;
  readonly warehouseName: string;
  readonly quantity: number;
  readonly unit: string;
  readonly minStock: number;
  readonly maxStock: number;
  readonly reorderPoint: number;
  readonly status: 'OPTIMAL' | 'LOW' | 'CRITICAL' | 'OVERSTOCKED';
  readonly lastCounted: Date;
  readonly nextExpectedCount: Date;
}

/**
 * Material movement record
 */
export interface MaterialMovement {
  readonly id: string;
  readonly materialId: string;
  readonly materialName: string;
  readonly materialCode: string;
  readonly movementType: MovementType;

  // Movement details
  readonly quantity: number;
  readonly unit: string;
  readonly fromWarehouse?: string;
  readonly toWarehouse?: string;
  readonly poNumber?: string;
  readonly projectId?: string;

  // People and auth
  readonly createdBy: string;
  readonly authorizedBy?: string;
  readonly timestamp: Date;

  // Documentation
  readonly documentNumber?: string;
  readonly reference?: string;
  readonly notes?: string;

  // Tracking
  readonly batchCode?: string;
  readonly expiryDate?: Date;
  readonly qualityStatus: 'ACCEPTED' | 'REJECTED' | 'PENDING_INSPECTION';
}

/**
 * Inventory count record (physical inventory)
 */
export interface InventoryCount {
  readonly id: string;
  readonly countDate: Date;
  readonly warehouseId: string;
  readonly warehouseName: string;
  readonly countedBy: string;
  readonly verifiedBy?: string;
  readonly countLines: InventoryCountLine[];
  readonly status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
  readonly variance: number; // percentage
  readonly notes?: string;
}

/**
 * Individual line in inventory count
 */
export interface InventoryCountLine {
  readonly id: string;
  readonly countId: string;
  readonly materialId: string;
  readonly materialName: string;
  readonly materialCode: string;
  readonly systemQuantity: number;
  readonly countedQuantity: number;
  readonly variance: number;
  readonly unit: string;
}

/**
 * Consumption forecast
 */
export interface ConsumptionForecast {
  readonly materialId: string;
  readonly materialName: string;
  readonly averageDailyConsumption: number;
  readonly forecastedDaysOfStock: number;
  readonly projectedStockOut?: Date;
  readonly recommendedReorderDate: Date;
  readonly recommendedQuantity: number;
  readonly confidence: number; // 0-100
}

/**
 * Main inventory model
 */
export interface Inventory {
  readonly id: string;
  readonly materialId: string;
  readonly material: {
    readonly id: string;
    readonly name: string;
    readonly code: string;
    readonly category: string;
  };

  // Current stock
  readonly currentStock: number;
  readonly unit: string;
  readonly valuation: number; // current value

  // Stock levels across warehouses
  readonly stockLevels: StockLevel[];
  readonly totalQuantity: number;

  // Thresholds
  readonly minStock: number;
  readonly maxStock: number;
  readonly reorderPoint: number;
  readonly safetyStock: number;

  // Status
  readonly status: 'OPTIMAL' | 'LOW' | 'CRITICAL' | 'OVERSTOCKED';
  readonly alertFlags: InventoryAlert[];

  // History
  readonly movements: MaterialMovement[];
  readonly lastMovement?: MaterialMovement;
  readonly lastReceptionDate?: Date;
  readonly lastDeliveryDate?: Date;

  // Forecasting
  readonly consumptionForecast: ConsumptionForecast;
  readonly projectedStockOut?: Date;
  readonly daysUntilStockOut?: number;

  // Metrics
  readonly turnoverRate: number; // times per year
  readonly averageAge: number; // days
  readonly holdingCost: number; // annual
  readonly lastCountDate: Date;
  readonly countAccuracy: number; // percentage

  // Metadata
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly lastUpdatedBy: string;
}

/**
 * Inventory alert
 */
export interface InventoryAlert {
  readonly id: string;
  readonly inventoryId: string;
  readonly type:
    | 'LOW_STOCK'
    | 'CRITICAL_STOCK'
    | 'OVERSTOCK'
    | 'NEAR_EXPIRY'
    | 'VARIANCE_DETECTED'
    | 'SLOW_MOVING';
  readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly message: string;
  readonly createdAt: Date;
  readonly resolvedAt?: Date;
  readonly recommendedAction?: string;
}

/**
 * Inventory dashboard summary
 */
export interface InventorySummary {
  readonly totalMaterials: number;
  readonly totalValue: number;
  readonly optimalStock: number;
  readonly lowStock: number;
  readonly criticalStock: number;
  readonly overstocked: number;
  readonly averageTurnoverRate: number;
  readonly totalAlerts: number;
  readonly pendingCounts: number;
}

/**
 * Zod Schema: Movement Type validation
 */
export const MovementTypeSchema = z.enum([
  'RECEPTION',
  'DELIVERY',
  'ADJUSTMENT',
  'CONSUMPTION',
  'RETURN',
]);

/**
 * Zod Schema: Warehouse Location validation
 */
export const WarehouseLocationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  code: z.string().min(1),
  address: z.string().min(1),
  capacity: z.number().positive(),
  currentUtilization: z.number().min(0).max(100),
  manager: z.string().uuid(),
  type: z.enum(['PRIMARY', 'SECONDARY', 'SITE']),
});

/**
 * Zod Schema: Stock Level validation
 */
export const StockLevelSchema = z.object({
  id: z.string().uuid(),
  materialId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  warehouseName: z.string().min(1),
  quantity: z.number().nonnegative(),
  unit: z.string().min(1),
  minStock: z.number().nonnegative(),
  maxStock: z.number().nonnegative(),
  reorderPoint: z.number().nonnegative(),
  status: z.enum(['OPTIMAL', 'LOW', 'CRITICAL', 'OVERSTOCKED']),
  lastCounted: z.date(),
  nextExpectedCount: z.date(),
});

/**
 * Zod Schema: Material Movement validation
 */
export const MaterialMovementSchema = z.object({
  id: z.string().uuid(),
  materialId: z.string().uuid(),
  materialName: z.string().min(1),
  materialCode: z.string().min(1),
  movementType: MovementTypeSchema,
  quantity: z.number().positive(),
  unit: z.string().min(1),
  fromWarehouse: z.string().uuid().optional(),
  toWarehouse: z.string().uuid().optional(),
  poNumber: z.string().optional(),
  projectId: z.string().uuid().optional(),
  createdBy: z.string().uuid(),
  authorizedBy: z.string().uuid().optional(),
  timestamp: z.date(),
  documentNumber: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
  batchCode: z.string().optional(),
  expiryDate: z.date().optional(),
  qualityStatus: z.enum(['ACCEPTED', 'REJECTED', 'PENDING_INSPECTION']),
});

/**
 * Zod Schema: Inventory Count Line validation
 */
export const InventoryCountLineSchema = z.object({
  id: z.string().uuid(),
  countId: z.string().uuid(),
  materialId: z.string().uuid(),
  materialName: z.string().min(1),
  materialCode: z.string().min(1),
  systemQuantity: z.number().nonnegative(),
  countedQuantity: z.number().nonnegative(),
  variance: z.number(),
  unit: z.string().min(1),
});

/**
 * Zod Schema: Inventory Count validation
 */
export const InventoryCountSchema = z.object({
  id: z.string().uuid(),
  countDate: z.date(),
  warehouseId: z.string().uuid(),
  warehouseName: z.string().min(1),
  countedBy: z.string().uuid(),
  verifiedBy: z.string().uuid().optional(),
  countLines: z.array(InventoryCountLineSchema),
  status: z.enum(['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED']),
  variance: z.number(),
  notes: z.string().optional(),
});

/**
 * Zod Schema: Consumption Forecast validation
 */
export const ConsumptionForecastSchema = z.object({
  materialId: z.string().uuid(),
  materialName: z.string().min(1),
  averageDailyConsumption: z.number().nonnegative(),
  forecastedDaysOfStock: z.number().nonnegative(),
  projectedStockOut: z.date().optional(),
  recommendedReorderDate: z.date(),
  recommendedQuantity: z.number().positive(),
  confidence: z.number().min(0).max(100),
});

/**
 * Zod Schema: Inventory Alert validation
 */
export const InventoryAlertSchema = z.object({
  id: z.string().uuid(),
  inventoryId: z.string().uuid(),
  type: z.enum([
    'LOW_STOCK',
    'CRITICAL_STOCK',
    'OVERSTOCK',
    'NEAR_EXPIRY',
    'VARIANCE_DETECTED',
    'SLOW_MOVING',
  ]),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  message: z.string().min(1),
  createdAt: z.date(),
  resolvedAt: z.date().optional(),
  recommendedAction: z.string().optional(),
});

/**
 * Zod Schema: Inventory validation
 */
export const InventorySchema = z.object({
  id: z.string().uuid(),
  materialId: z.string().uuid(),
  material: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    code: z.string().min(1),
    category: z.string().min(1),
  }),
  currentStock: z.number().nonnegative(),
  unit: z.string().min(1),
  valuation: z.number().nonnegative(),
  stockLevels: z.array(StockLevelSchema),
  totalQuantity: z.number().nonnegative(),
  minStock: z.number().nonnegative(),
  maxStock: z.number().nonnegative(),
  reorderPoint: z.number().nonnegative(),
  safetyStock: z.number().nonnegative(),
  status: z.enum(['OPTIMAL', 'LOW', 'CRITICAL', 'OVERSTOCKED']),
  alertFlags: z.array(InventoryAlertSchema),
  movements: z.array(MaterialMovementSchema),
  lastMovement: MaterialMovementSchema.optional(),
  lastReceptionDate: z.date().optional(),
  lastDeliveryDate: z.date().optional(),
  consumptionForecast: ConsumptionForecastSchema,
  projectedStockOut: z.date().optional(),
  daysUntilStockOut: z.number().nonnegative().optional(),
  turnoverRate: z.number().nonnegative(),
  averageAge: z.number().nonnegative(),
  holdingCost: z.number().nonnegative(),
  lastCountDate: z.date(),
  countAccuracy: z.number().min(0).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastUpdatedBy: z.string().uuid(),
});

/**
 * Zod Schema: Inventory Summary validation
 */
export const InventorySummarySchema = z.object({
  totalMaterials: z.number().nonnegative(),
  totalValue: z.number().nonnegative(),
  optimalStock: z.number().nonnegative(),
  lowStock: z.number().nonnegative(),
  criticalStock: z.number().nonnegative(),
  overstocked: z.number().nonnegative(),
  averageTurnoverRate: z.number().nonnegative(),
  totalAlerts: z.number().nonnegative(),
  pendingCounts: z.number().nonnegative(),
});

/**
 * Type inference from Zod schemas
 */
export type InventoryType = z.infer<typeof InventorySchema>;
export type StockLevelType = z.infer<typeof StockLevelSchema>;
export type MaterialMovementType = z.infer<typeof MaterialMovementSchema>;
export type InventoryCountType = z.infer<typeof InventoryCountSchema>;
export type InventoryCountLineType = z.infer<typeof InventoryCountLineSchema>;
export type ConsumptionForecastType = z.infer<typeof ConsumptionForecastSchema>;
export type InventoryAlertType = z.infer<typeof InventoryAlertSchema>;
export type InventorySummaryType = z.infer<typeof InventorySummarySchema>;
export type WarehouseLocationType = z.infer<typeof WarehouseLocationSchema>;
