/**
 * @file Material and Category Types
 * @description Tipos para materiales, 15 categorías y seguimiento de histórico de precios
 * @module lib/mockup-data/types/material
 * @exports MaterialCategory, MaterialCategoryEnum, CategoryMetadata, MATERIAL_CATEGORY_METADATA, MaterialStatus, MaterialStatusEnum, PriceHistoryEntry, Material, MaterialFilter, MaterialComparison, SupplierPricingInfo, MaterialCategorySchema, MaterialStatusSchema, PriceHistoryEntrySchema, MaterialSchema, MaterialFilterSchema, SupplierPricingInfoSchema, MaterialComparisonSchema
 */

import { z } from 'zod';

/**
 * Material categories - 15 types across construction/civil works
 */
export type MaterialCategory =
  | 'CEMENTO'
  | 'ACERO'
  | 'MADERA'
  | 'HORMIGON'
  | 'ARENA'
  | 'GRAVA'
  | 'LADRILLOS'
  | 'TUBERIAS'
  | 'ELECTRICIDAD'
  | 'EQUIPOS'
  | 'HERRAMIENTAS'
  | 'COMBUSTIBLE'
  | 'SERVICIOS'
  | 'LABORATORIO'
  | 'OTROS';

export const MaterialCategoryEnum = {
  CEMENTO: 'CEMENTO' as const,
  ACERO: 'ACERO' as const,
  MADERA: 'MADERA' as const,
  HORMIGON: 'HORMIGON' as const,
  ARENA: 'ARENA' as const,
  GRAVA: 'GRAVA' as const,
  LADRILLOS: 'LADRILLOS' as const,
  TUBERIAS: 'TUBERIAS' as const,
  ELECTRICIDAD: 'ELECTRICIDAD' as const,
  EQUIPOS: 'EQUIPOS' as const,
  HERRAMIENTAS: 'HERRAMIENTAS' as const,
  COMBUSTIBLE: 'COMBUSTIBLE' as const,
  SERVICIOS: 'SERVICIOS' as const,
  LABORATORIO: 'LABORATORIO' as const,
  OTROS: 'OTROS' as const,
} as const;

/**
 * Category metadata for UI
 */
export interface CategoryMetadata {
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly defaultUnit: string;
}

export const MATERIAL_CATEGORY_METADATA: Record<MaterialCategory, CategoryMetadata> = {
  CEMENTO: {
    label: 'Cemento',
    description: 'Cementos y conglomerantes',
    icon: 'Package',
    defaultUnit: 'kg',
  },
  ACERO: {
    label: 'Acero',
    description: 'Acero estructural y refuerzo',
    icon: 'Box',
    defaultUnit: 'kg',
  },
  MADERA: {
    label: 'Madera',
    description: 'Madera y encofrados',
    icon: 'TreePine',
    defaultUnit: 'm3',
  },
  HORMIGON: {
    label: 'Hormigón',
    description: 'Hormigón y premezclados',
    icon: 'Box',
    defaultUnit: 'm3',
  },
  ARENA: {
    label: 'Arena',
    description: 'Arena y áridos',
    icon: 'Layers',
    defaultUnit: 'm3',
  },
  GRAVA: {
    label: 'Grava',
    description: 'Grava y agregados',
    icon: 'Layers',
    defaultUnit: 'm3',
  },
  LADRILLOS: {
    label: 'Ladrillos',
    description: 'Ladrillos y bloques',
    icon: 'Square',
    defaultUnit: 'unidad',
  },
  TUBERIAS: {
    label: 'Tuberías',
    description: 'Tuberías y accesorios',
    icon: 'Pipe',
    defaultUnit: 'm',
  },
  ELECTRICIDAD: {
    label: 'Electricidad',
    description: 'Materiales eléctricos',
    icon: 'Zap',
    defaultUnit: 'unidad',
  },
  EQUIPOS: {
    label: 'Equipos',
    description: 'Equipos y maquinaria',
    icon: 'Wrench',
    defaultUnit: 'unidad',
  },
  HERRAMIENTAS: {
    label: 'Herramientas',
    description: 'Herramientas menores',
    icon: 'Hammer',
    defaultUnit: 'unidad',
  },
  COMBUSTIBLE: {
    label: 'Combustible',
    description: 'Combustibles y lubricantes',
    icon: 'Fuel',
    defaultUnit: 'litro',
  },
  SERVICIOS: {
    label: 'Servicios',
    description: 'Servicios y subcontratos',
    icon: 'Users',
    defaultUnit: 'servicio',
  },
  LABORATORIO: {
    label: 'Laboratorio',
    description: 'Pruebas y certificaciones',
    icon: 'TestTube',
    defaultUnit: 'prueba',
  },
  OTROS: {
    label: 'Otros',
    description: 'Otros materiales',
    icon: 'Box',
    defaultUnit: 'unidad',
  },
};

/**
 * Material status
 */
export type MaterialStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';

export const MaterialStatusEnum = {
  ACTIVE: 'ACTIVE' as const,
  INACTIVE: 'INACTIVE' as const,
  DISCONTINUED: 'DISCONTINUED' as const,
} as const;

/**
 * Price history entry - tracks price variations over time
 * Critical for F007 Análisis de Precios
 */
export interface PriceHistoryEntry {
  readonly id: string;
  readonly materialId: string;
  readonly price: number;
  readonly currency: string;
  readonly supplierName: string;
  readonly supplierId: string;
  readonly quantity: number;
  readonly unit: string;
  readonly date: Date;
  readonly poNumber?: string;
  readonly notes?: string;
}

/**
 * Material model - complete definition
 */
export interface Material {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly category: MaterialCategory;
  readonly status: MaterialStatus;

  // Unit tracking
  readonly unit: string;
  readonly unitAlternatives: string[];

  // Pricing
  readonly currentPrice: number;
  readonly previousPrice?: number;
  readonly currency: string;
  readonly lastPriceUpdate: Date;

  // Supplier relationships
  readonly preferredSupplierId?: string;
  readonly alternateSuppliers: string[];

  // Inventory
  readonly minStock: number;
  readonly maxStock: number;
  readonly reorderPoint: number;
  readonly leadTimeDays: number;

  // Specifications
  readonly specifications: Record<string, string>;
  readonly quality: string;
  readonly certifications: string[];

  // Price history (for anomaly detection)
  readonly priceHistory: PriceHistoryEntry[];
  readonly priceVolatility: number; // percentage, standard deviation
  readonly averagePriceLastThirtyDays: number;
  readonly averagePriceLastNinetyDays: number;

  // Tracking
  readonly usageCount: number; // times purchased
  readonly lastUsedDate?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdBy: string;
  readonly updatedBy: string;

  // Metadata
  readonly tags: string[];
  readonly isHazardous: boolean;
  readonly requiresCertificate: boolean;
}

/**
 * Material search filter
 */
export interface MaterialFilter {
  readonly categories?: MaterialCategory[];
  readonly status?: MaterialStatus;
  readonly search?: string;
  readonly maxPrice?: number;
  readonly minPrice?: number;
  readonly suppliers?: string[];
}

/**
 * Material comparison for pricing analysis
 */
export interface MaterialComparison {
  readonly materialId: string;
  readonly materialName: string;
  readonly suppliers: SupplierPricingInfo[];
  readonly priceRange: {
    readonly min: number;
    readonly max: number;
    readonly average: number;
    readonly deviation: number;
  };
  readonly recommendation?: string;
}

/**
 * Supplier pricing information
 */
export interface SupplierPricingInfo {
  readonly supplierId: string;
  readonly supplierName: string;
  readonly price: number;
  readonly quantity: number;
  readonly leadTime: number;
  readonly lastQuote: Date;
  readonly reliability: number; // 0-100
}

/**
 * Zod Schema: Material Category validation
 */
export const MaterialCategorySchema = z.enum([
  'CEMENTO',
  'ACERO',
  'MADERA',
  'HORMIGON',
  'ARENA',
  'GRAVA',
  'LADRILLOS',
  'TUBERIAS',
  'ELECTRICIDAD',
  'EQUIPOS',
  'HERRAMIENTAS',
  'COMBUSTIBLE',
  'SERVICIOS',
  'LABORATORIO',
  'OTROS',
]);

/**
 * Zod Schema: Material Status validation
 */
export const MaterialStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED']);

/**
 * Zod Schema: Price History Entry validation
 */
export const PriceHistoryEntrySchema = z.object({
  id: z.string().uuid(),
  materialId: z.string().uuid(),
  price: z.number().nonnegative(),
  currency: z.string().length(3),
  supplierName: z.string().min(1),
  supplierId: z.string().uuid(),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  date: z.date(),
  poNumber: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Zod Schema: Material validation
 */
export const MaterialSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  category: MaterialCategorySchema,
  status: MaterialStatusSchema,
  unit: z.string().min(1),
  unitAlternatives: z.array(z.string()),
  currentPrice: z.number().nonnegative(),
  previousPrice: z.number().nonnegative().optional(),
  currency: z.string().length(3),
  lastPriceUpdate: z.date(),
  preferredSupplierId: z.string().uuid().optional(),
  alternateSuppliers: z.array(z.string().uuid()),
  minStock: z.number().nonnegative(),
  maxStock: z.number().nonnegative(),
  reorderPoint: z.number().nonnegative(),
  leadTimeDays: z.number().positive(),
  specifications: z.record(z.string(), z.string()),
  quality: z.string().min(1),
  certifications: z.array(z.string()),
  priceHistory: z.array(PriceHistoryEntrySchema),
  priceVolatility: z.number().nonnegative(),
  averagePriceLastThirtyDays: z.number().nonnegative(),
  averagePriceLastNinetyDays: z.number().nonnegative(),
  usageCount: z.number().nonnegative(),
  lastUsedDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid(),
  tags: z.array(z.string()),
  isHazardous: z.boolean(),
  requiresCertificate: z.boolean(),
});

/**
 * Zod Schema: Material Filter validation
 */
export const MaterialFilterSchema = z.object({
  categories: z.array(MaterialCategorySchema).optional(),
  status: MaterialStatusSchema.optional(),
  search: z.string().optional(),
  maxPrice: z.number().nonnegative().optional(),
  minPrice: z.number().nonnegative().optional(),
  suppliers: z.array(z.string().uuid()).optional(),
});

/**
 * Zod Schema: Supplier Pricing Info validation
 */
export const SupplierPricingInfoSchema = z.object({
  supplierId: z.string().uuid(),
  supplierName: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().positive(),
  leadTime: z.number().positive(),
  lastQuote: z.date(),
  reliability: z.number().min(0).max(100),
});

/**
 * Zod Schema: Material Comparison validation
 */
export const MaterialComparisonSchema = z.object({
  materialId: z.string().uuid(),
  materialName: z.string().min(1),
  suppliers: z.array(SupplierPricingInfoSchema),
  priceRange: z.object({
    min: z.number().nonnegative(),
    max: z.number().nonnegative(),
    average: z.number().nonnegative(),
    deviation: z.number().nonnegative(),
  }),
  recommendation: z.string().optional(),
});

/**
 * Type inference from Zod schemas
 */
export type MaterialType = z.infer<typeof MaterialSchema>;
export type PriceHistoryEntryType = z.infer<typeof PriceHistoryEntrySchema>;
export type MaterialFilterType = z.infer<typeof MaterialFilterSchema>;
export type SupplierPricingInfoType = z.infer<typeof SupplierPricingInfoSchema>;
export type MaterialComparisonType = z.infer<typeof MaterialComparisonSchema>;
