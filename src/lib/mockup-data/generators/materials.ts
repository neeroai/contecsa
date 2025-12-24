/**
 * Materials Data Generator
 * Contecsa Sistema de Inteligencia de Datos
 *
 * Version: 1.0 | Date: 2025-12-24 13:00
 *
 * Generates 30+ construction materials across 15 categories.
 * Includes price history for the last 6 months for anomaly detection.
 */

import type { Material, MaterialCategory, PriceHistoryEntry } from '../types';
import { getSuppliersByCategory } from './suppliers';
import { USERS } from './users';
import { calculateStats, deterministicUUID, getCurrentDate, rng, subtractMonths } from './utils';

/**
 * Material definition for generation
 */
interface MaterialDef {
  name: string;
  code: string;
  category: MaterialCategory;
  unit: string;
  basePrice: number;
  minStock: number;
  maxStock: number;
  leadTimeDays: number;
  specifications: Record<string, string>;
  quality: string;
  certifications: string[];
  isHazardous: boolean;
  requiresCertificate: boolean;
}

/**
 * Material catalog definitions
 */
const MATERIAL_DEFINITIONS: MaterialDef[] = [
  // CEMENTO
  {
    name: 'Cemento Portland Tipo I',
    code: 'CEM-001',
    category: 'CEMENTO',
    unit: 'kg',
    basePrice: 450,
    minStock: 10000,
    maxStock: 50000,
    leadTimeDays: 7,
    specifications: { tipo: 'Tipo I', norma: 'NTC 121' },
    quality: 'Alta',
    certifications: ['NTC 121', 'ISO 9001'],
    isHazardous: false,
    requiresCertificate: true,
  },
  {
    name: 'Cemento Portland Tipo III',
    code: 'CEM-002',
    category: 'CEMENTO',
    unit: 'kg',
    basePrice: 520,
    minStock: 5000,
    maxStock: 25000,
    leadTimeDays: 7,
    specifications: { tipo: 'Tipo III', norma: 'NTC 121', uso: 'Alta resistencia temprana' },
    quality: 'Alta',
    certifications: ['NTC 121', 'ISO 9001'],
    isHazardous: false,
    requiresCertificate: true,
  },

  // ACERO
  {
    name: 'Varilla Corrugada 3/8"',
    code: 'ACE-001',
    category: 'ACERO',
    unit: 'kg',
    basePrice: 3500,
    minStock: 5000,
    maxStock: 30000,
    leadTimeDays: 10,
    specifications: { diametro: '3/8"', grado: '60', norma: 'NTC 2289' },
    quality: 'Alta',
    certifications: ['NTC 2289'],
    isHazardous: false,
    requiresCertificate: true,
  },
  {
    name: 'Varilla Corrugada 1/2"',
    code: 'ACE-002',
    category: 'ACERO',
    unit: 'kg',
    basePrice: 3600,
    minStock: 8000,
    maxStock: 40000,
    leadTimeDays: 10,
    specifications: { diametro: '1/2"', grado: '60', norma: 'NTC 2289' },
    quality: 'Alta',
    certifications: ['NTC 2289'],
    isHazardous: false,
    requiresCertificate: true,
  },
  {
    name: 'Malla Electrosoldada',
    code: 'ACE-003',
    category: 'ACERO',
    unit: 'm2',
    basePrice: 25000,
    minStock: 500,
    maxStock: 2000,
    leadTimeDays: 14,
    specifications: { tipo: 'Q188', calibre: '5.5mm', norma: 'NTC 2310' },
    quality: 'Media',
    certifications: ['NTC 2310'],
    isHazardous: false,
    requiresCertificate: false,
  },

  // MADERA
  {
    name: 'Tabla Pino 1"x12"x10\'',
    code: 'MAD-001',
    category: 'MADERA',
    unit: 'unidad',
    basePrice: 18000,
    minStock: 200,
    maxStock: 1000,
    leadTimeDays: 14,
    specifications: { especie: 'Pino', dimensiones: '1"x12"x10\'' },
    quality: 'Media',
    certifications: [],
    isHazardous: false,
    requiresCertificate: false,
  },
  {
    name: 'Triplex 15mm',
    code: 'MAD-002',
    category: 'MADERA',
    unit: 'm2',
    basePrice: 35000,
    minStock: 100,
    maxStock: 500,
    leadTimeDays: 10,
    specifications: { espesor: '15mm', tipo: 'Estructural' },
    quality: 'Alta',
    certifications: ['NTC 2261'],
    isHazardous: false,
    requiresCertificate: false,
  },

  // HORMIGON
  {
    name: 'Concreto Premezclado 3000 PSI',
    code: 'HOR-001',
    category: 'HORMIGON',
    unit: 'm3',
    basePrice: 320000,
    minStock: 0,
    maxStock: 0,
    leadTimeDays: 2,
    specifications: { resistencia: '3000 PSI', asentamiento: '10 cm', norma: 'NTC 3318' },
    quality: 'Alta',
    certifications: ['NTC 3318', 'ISO 9001'],
    isHazardous: false,
    requiresCertificate: true,
  },
  {
    name: 'Concreto Premezclado 4000 PSI',
    code: 'HOR-002',
    category: 'HORMIGON',
    unit: 'm3',
    basePrice: 380000,
    minStock: 0,
    maxStock: 0,
    leadTimeDays: 2,
    specifications: { resistencia: '4000 PSI', asentamiento: '10 cm', norma: 'NTC 3318' },
    quality: 'Alta',
    certifications: ['NTC 3318', 'ISO 9001'],
    isHazardous: false,
    requiresCertificate: true,
  },

  // ARENA
  {
    name: 'Arena de Río Lavada',
    code: 'ARE-001',
    category: 'ARENA',
    unit: 'm3',
    basePrice: 85000,
    minStock: 50,
    maxStock: 200,
    leadTimeDays: 3,
    specifications: { origen: 'Río', tipo: 'Lavada', modulo_finura: '2.8' },
    quality: 'Media',
    certifications: [],
    isHazardous: false,
    requiresCertificate: false,
  },
  {
    name: 'Arena de Peña',
    code: 'ARE-002',
    category: 'ARENA',
    unit: 'm3',
    basePrice: 95000,
    minStock: 30,
    maxStock: 150,
    leadTimeDays: 5,
    specifications: { origen: 'Peña', tipo: 'Triturada' },
    quality: 'Alta',
    certifications: [],
    isHazardous: false,
    requiresCertificate: false,
  },

  // GRAVA
  {
    name: 'Grava 3/4"',
    code: 'GRA-001',
    category: 'GRAVA',
    unit: 'm3',
    basePrice: 95000,
    minStock: 50,
    maxStock: 250,
    leadTimeDays: 3,
    specifications: { tamano: '3/4"', tipo: 'Triturada' },
    quality: 'Media',
    certifications: [],
    isHazardous: false,
    requiresCertificate: false,
  },
  {
    name: 'Grava 1"',
    code: 'GRA-002',
    category: 'GRAVA',
    unit: 'm3',
    basePrice: 92000,
    minStock: 40,
    maxStock: 200,
    leadTimeDays: 3,
    specifications: { tamano: '1"', tipo: 'Triturada' },
    quality: 'Media',
    certifications: [],
    isHazardous: false,
    requiresCertificate: false,
  },

  // LADRILLOS
  {
    name: 'Ladrillo Tolete Prensado',
    code: 'LAD-001',
    category: 'LADRILLOS',
    unit: 'unidad',
    basePrice: 850,
    minStock: 5000,
    maxStock: 20000,
    leadTimeDays: 7,
    specifications: { tipo: 'Prensado', dimensiones: '6x12x24 cm' },
    quality: 'Media',
    certifications: ['NTC 4205'],
    isHazardous: false,
    requiresCertificate: false,
  },
  {
    name: 'Bloque Estructural #4',
    code: 'LAD-002',
    category: 'LADRILLOS',
    unit: 'unidad',
    basePrice: 2200,
    minStock: 3000,
    maxStock: 15000,
    leadTimeDays: 7,
    specifications: { tipo: 'Estructural', numero: '#4', dimensiones: '10x20x40 cm' },
    quality: 'Alta',
    certifications: ['NTC 4026'],
    isHazardous: false,
    requiresCertificate: true,
  },

  // TUBERIAS
  {
    name: 'Tubería PVC 4" Sanitaria',
    code: 'TUB-001',
    category: 'TUBERIAS',
    unit: 'm',
    basePrice: 18000,
    minStock: 200,
    maxStock: 1000,
    leadTimeDays: 7,
    specifications: { diametro: '4"', tipo: 'Sanitaria', norma: 'NTC 1339' },
    quality: 'Alta',
    certifications: ['NTC 1339'],
    isHazardous: false,
    requiresCertificate: false,
  },
  {
    name: 'Tubería PVC 2" Presión',
    code: 'TUB-002',
    category: 'TUBERIAS',
    unit: 'm',
    basePrice: 12000,
    minStock: 300,
    maxStock: 1500,
    leadTimeDays: 7,
    specifications: { diametro: '2"', tipo: 'Presión RDE 21', presion: '160 PSI' },
    quality: 'Alta',
    certifications: ['NTC 382'],
    isHazardous: false,
    requiresCertificate: false,
  },

  // ELECTRICIDAD
  {
    name: 'Cable THHN 12 AWG',
    code: 'ELE-001',
    category: 'ELECTRICIDAD',
    unit: 'm',
    basePrice: 3500,
    minStock: 1000,
    maxStock: 5000,
    leadTimeDays: 5,
    specifications: { calibre: '12 AWG', tipo: 'THHN', voltaje: '600V' },
    quality: 'Alta',
    certifications: ['NTC 1332', 'UL'],
    isHazardous: false,
    requiresCertificate: false,
  },
  {
    name: 'Cable THHN 10 AWG',
    code: 'ELE-002',
    category: 'ELECTRICIDAD',
    unit: 'm',
    basePrice: 5200,
    minStock: 800,
    maxStock: 4000,
    leadTimeDays: 5,
    specifications: { calibre: '10 AWG', tipo: 'THHN', voltaje: '600V' },
    quality: 'Alta',
    certifications: ['NTC 1332', 'UL'],
    isHazardous: false,
    requiresCertificate: false,
  },

  // EQUIPOS
  {
    name: 'Mezcladora de Concreto 1 Bulto',
    code: 'EQU-001',
    category: 'EQUIPOS',
    unit: 'unidad',
    basePrice: 3500000,
    minStock: 2,
    maxStock: 5,
    leadTimeDays: 30,
    specifications: { capacidad: '1 bulto', motor: 'Eléctrico 3HP' },
    quality: 'Alta',
    certifications: [],
    isHazardous: false,
    requiresCertificate: false,
  },
  {
    name: 'Vibrador de Concreto',
    code: 'EQU-002',
    category: 'EQUIPOS',
    unit: 'unidad',
    basePrice: 1800000,
    minStock: 3,
    maxStock: 10,
    leadTimeDays: 20,
    specifications: { tipo: 'Gasolina', longitud: '4m' },
    quality: 'Media',
    certifications: [],
    isHazardous: false,
    requiresCertificate: false,
  },

  // HERRAMIENTAS
  {
    name: 'Pala Cuadrada',
    code: 'HER-001',
    category: 'HERRAMIENTAS',
    unit: 'unidad',
    basePrice: 45000,
    minStock: 20,
    maxStock: 50,
    leadTimeDays: 7,
    specifications: { tipo: 'Cuadrada', material: 'Acero' },
    quality: 'Media',
    certifications: [],
    isHazardous: false,
    requiresCertificate: false,
  },
  {
    name: 'Carretilla de Obra',
    code: 'HER-002',
    category: 'HERRAMIENTAS',
    unit: 'unidad',
    basePrice: 150000,
    minStock: 10,
    maxStock: 30,
    leadTimeDays: 10,
    specifications: { capacidad: '80 litros', rueda: 'Neumática' },
    quality: 'Media',
    certifications: [],
    isHazardous: false,
    requiresCertificate: false,
  },

  // COMBUSTIBLE
  {
    name: 'Diesel',
    code: 'COM-001',
    category: 'COMBUSTIBLE',
    unit: 'litro',
    basePrice: 12500,
    minStock: 500,
    maxStock: 2000,
    leadTimeDays: 2,
    specifications: { tipo: 'Diesel', norma: 'NTC 1438' },
    quality: 'Alta',
    certifications: ['NTC 1438'],
    isHazardous: true,
    requiresCertificate: true,
  },
  {
    name: 'Gasolina Corriente',
    code: 'COM-002',
    category: 'COMBUSTIBLE',
    unit: 'litro',
    basePrice: 13800,
    minStock: 300,
    maxStock: 1500,
    leadTimeDays: 2,
    specifications: { tipo: 'Corriente', octanaje: '87' },
    quality: 'Alta',
    certifications: [],
    isHazardous: true,
    requiresCertificate: true,
  },

  // SERVICIOS
  {
    name: 'Ensayo Compresión Concreto',
    code: 'SER-001',
    category: 'LABORATORIO',
    unit: 'prueba',
    basePrice: 85000,
    minStock: 0,
    maxStock: 0,
    leadTimeDays: 5,
    specifications: { norma: 'NTC 673', edad: '28 días' },
    quality: 'Alta',
    certifications: ['ONAC'],
    isHazardous: false,
    requiresCertificate: true,
  },
  {
    name: 'Ensayo Proctor Modificado',
    code: 'SER-002',
    category: 'LABORATORIO',
    unit: 'prueba',
    basePrice: 120000,
    minStock: 0,
    maxStock: 0,
    leadTimeDays: 7,
    specifications: { norma: 'NTC 1776', tipo: 'Modificado' },
    quality: 'Alta',
    certifications: ['ONAC'],
    isHazardous: false,
    requiresCertificate: true,
  },
];

/**
 * Generate price history for a material
 */
function generatePriceHistory(
  materialId: string,
  basePrice: number,
  category: MaterialCategory,
): PriceHistoryEntry[] {
  const history: PriceHistoryEntry[] = [];
  const suppliers = getSuppliersByCategory(category);

  if (suppliers.length === 0) {
    return history;
  }

  const currentDate = getCurrentDate();

  // Generate 6 months of history
  for (let month = 6; month >= 1; month--) {
    const date = subtractMonths(currentDate, month);
    const supplier = rng.pick(suppliers);

    // Add some price variation (±5%)
    const priceVariation = rng.float(-0.05, 0.05);
    const price = basePrice * (1 + priceVariation);

    history.push({
      id: deterministicUUID(`price-${materialId}-${month}`),
      materialId,
      price,
      currency: 'COP',
      supplierName: supplier.name,
      supplierId: supplier.id,
      quantity: rng.int(10, 1000),
      unit:
        MATERIAL_DEFINITIONS.find((m) => m.code === materialId.split('-').pop())?.unit || 'unidad',
      date,
      poNumber: `PO-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${rng.int(1, 99)}`,
      notes: month === 1 ? 'Precio más reciente' : undefined,
    });
  }

  return history;
}

/**
 * Generate a single material
 */
function generateMaterial(def: MaterialDef): Material {
  const id = deterministicUUID(`material-${def.code}`);
  const priceHistory = generatePriceHistory(id, def.basePrice, def.category);

  // Calculate price statistics
  const prices = priceHistory.map((h) => h.price);
  const stats = calculateStats(prices);

  const suppliers = getSuppliersByCategory(def.category);
  const preferredSupplier = suppliers.length > 0 ? rng.pick(suppliers) : undefined;
  const alternateSuppliers =
    suppliers.length > 1 ? rng.pickN(suppliers, Math.min(2, suppliers.length - 1)) : [];

  const creator = rng.pick(USERS);

  return {
    id,
    code: def.code,
    name: def.name,
    description: `${def.name} - ${def.quality} calidad`,
    category: def.category,
    status: 'ACTIVE',
    unit: def.unit,
    unitAlternatives: [],
    currentPrice: def.basePrice,
    previousPrice:
      priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].price : undefined,
    currency: 'COP',
    lastPriceUpdate: getCurrentDate(),
    preferredSupplierId: preferredSupplier?.id,
    alternateSuppliers: alternateSuppliers.map((s) => s.id),
    minStock: def.minStock,
    maxStock: def.maxStock,
    reorderPoint: def.minStock + (def.maxStock - def.minStock) * 0.2,
    leadTimeDays: def.leadTimeDays,
    specifications: def.specifications,
    quality: def.quality,
    certifications: def.certifications,
    priceHistory,
    priceVolatility: (stats.stdDev / stats.mean) * 100,
    averagePriceLastThirtyDays: stats.mean,
    averagePriceLastNinetyDays: stats.mean,
    usageCount: rng.int(5, 50),
    lastUsedDate: subtractDays(getCurrentDate(), rng.int(1, 90)),
    createdAt: subtractMonths(getCurrentDate(), 12),
    updatedAt: getCurrentDate(),
    createdBy: creator.id,
    updatedBy: creator.id,
    tags: [def.category, def.quality],
    isHazardous: def.isHazardous,
    requiresCertificate: def.requiresCertificate,
  };
}

/**
 * Generate all materials
 */
export function generateMaterials(): Material[] {
  return MATERIAL_DEFINITIONS.map((def) => generateMaterial(def));
}

/**
 * Pre-generated materials
 */
export const MATERIALS = generateMaterials();

/**
 * Helper: Get material by code
 */
export function getMaterialByCode(code: string): Material | undefined {
  return MATERIALS.find((m) => m.code === code);
}

/**
 * Helper: Get materials by category
 */
export function getMaterialsByCategory(category: MaterialCategory): Material[] {
  return MATERIALS.filter((m) => m.category === category);
}

/**
 * Helper: Get random material
 */
export function getRandomMaterial(): Material {
  return rng.pick(MATERIALS);
}

/**
 * Helper: Get random material by category
 */
export function getRandomMaterialByCategory(category: MaterialCategory): Material {
  const materials = getMaterialsByCategory(category);
  if (materials.length === 0) {
    throw new Error(`No materials found for category: ${category}`);
  }
  return rng.pick(materials);
}

function subtractDays(arg0: Date, arg1: number): Date | undefined {
  const result = new Date(arg0);
  result.setDate(result.getDate() - arg1);
  return result;
}
