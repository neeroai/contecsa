/**
 * @file Suppliers Data Generator
 * @description Genera 20+ proveedores de construcción con datos colombianos realistas
 * @module lib/mockup-data/generators/suppliers
 * @exports generateSuppliers, SUPPLIERS, generateSupplier, getSupplierByName, getSuppliersByCategory, getRandomSupplier, getRandomSupplierByCategory, Supplier
 */

import {
  COLOMBIAN_CITIES,
  deterministicUUID,
  generateAddress,
  generateNIT,
  generatePhone,
  rng,
} from './utils';

/**
 * Supplier data structure
 */
export interface Supplier {
  readonly id: string;
  readonly name: string;
  readonly nit: string;
  readonly address: string;
  readonly city: string;
  readonly phone: string;
  readonly email: string;
  readonly contactPerson: string;
  readonly category: string[];
  readonly reliability: number; // 0-100
  readonly isActive: boolean;
}

/**
 * Generate a single construction materials supplier
 * Creates supplier with NIT, address, and reliability score (75-98%)
 *
 * @param name - Supplier legal name, e.g., "Cementos Argos S.A."
 * @param categories - Array of material categories, e.g., ["CEMENTO", "HORMIGON"]
 * @param city - City name, random if not specified
 * @returns Supplier object with contact and reliability info
 *
 * @example
 * ```ts
 * const supplier = generateSupplier('Cementos Argos S.A.', ['CEMENTO', 'HORMIGON']);
 * console.log(supplier.reliability); // 75-98
 * ```
 */
export function generateSupplier(
  name: string,
  categories: string[],
  city: string = rng.pick(COLOMBIAN_CITIES),
): Supplier {
  const id = deterministicUUID(`supplier-${name}`);
  const nit = generateNIT();
  const address = generateAddress();
  const phone = generatePhone(false);
  const domain =
    name
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '') + '.com';
  const email = `ventas@${domain}`;
  const contactNames = [
    'Carlos Mendoza',
    'Ana Ruiz',
    'Jorge Silva',
    'Laura Castro',
    'Miguel Vargas',
    'Diana Romero',
    'Fernando López',
    'Patricia Moreno',
  ];
  const contactPerson = rng.pick(contactNames);
  const reliability = rng.int(75, 98);

  return {
    id,
    name,
    nit,
    address,
    city,
    phone,
    email,
    contactPerson,
    category: categories,
    reliability,
    isActive: true,
  };
}

/**
 * Generate 20+ Colombian construction materials suppliers
 * Covers cement, steel, aggregates, wood, bricks, pipes, electrical, etc.
 *
 * @returns Array of 20+ Supplier objects across categories
 *
 * @example
 * ```ts
 * const suppliers = generateSuppliers();
 * console.log(suppliers.length); // 20+
 * const cementSuppliers = suppliers.filter(s => s.category.includes('CEMENTO'));
 * console.log(cementSuppliers.length); // 4
 * ```
 */
export function generateSuppliers(): Supplier[] {
  const suppliers: Supplier[] = [];

  // MAJOR CONSTRUCTION MATERIALS SUPPLIERS
  suppliers.push(
    generateSupplier('Cementos Argos S.A.', ['CEMENTO', 'HORMIGON'], 'Bogotá'),
    generateSupplier('Cemex Colombia S.A.', ['CEMENTO', 'HORMIGON', 'GRAVA'], 'Medellín'),
    generateSupplier('Holcim Colombia S.A.', ['CEMENTO', 'HORMIGON'], 'Bogotá'),
    generateSupplier('Concretos Premezclados S.A.', ['HORMIGON'], 'Barranquilla'),
  );

  // STEEL AND METAL SUPPLIERS
  suppliers.push(
    generateSupplier('Acerías Paz del Río', ['ACERO'], 'Bogotá'),
    generateSupplier('Diaco S.A.', ['ACERO', 'HERRAMIENTAS'], 'Medellín'),
    generateSupplier('Siderúrgica del Caribe', ['ACERO'], 'Barranquilla'),
  );

  // AGGREGATES AND MATERIALS
  suppliers.push(
    generateSupplier('Agregados Andinos Ltda.', ['ARENA', 'GRAVA'], 'Cali'),
    generateSupplier('Arenas del Magdalena', ['ARENA'], 'Santa Marta'),
    generateSupplier('Gravas y Piedras del Norte', ['GRAVA', 'ARENA'], 'Cúcuta'),
  );

  // WOOD AND LUMBER
  suppliers.push(
    generateSupplier('Maderas Pizano S.A.', ['MADERA'], 'Bogotá'),
    generateSupplier('Tablemac S.A.', ['MADERA'], 'Medellín'),
  );

  // BRICKS AND BLOCKS
  suppliers.push(
    generateSupplier('Ladrillera Santafé', ['LADRILLOS'], 'Bogotá'),
    generateSupplier('Blocol S.A.', ['LADRILLOS'], 'Cali'),
  );

  // PIPES AND PLUMBING
  suppliers.push(
    generateSupplier('Pavco S.A.', ['TUBERIAS'], 'Bogotá'),
    generateSupplier('Tubos y Accesorios del Caribe', ['TUBERIAS'], 'Cartagena'),
  );

  // ELECTRICAL SUPPLIES
  suppliers.push(
    generateSupplier('Centelsa S.A.', ['ELECTRICIDAD'], 'Bogotá'),
    generateSupplier('Eléctricos y Cables Ltda.', ['ELECTRICIDAD'], 'Medellín'),
  );

  // EQUIPMENT AND MACHINERY
  suppliers.push(
    generateSupplier('Maquinaria Andina S.A.', ['EQUIPOS', 'HERRAMIENTAS'], 'Bogotá'),
    generateSupplier('Equipos y Construcciones', ['EQUIPOS'], 'Barranquilla'),
  );

  // FUEL AND LUBRICANTS
  suppliers.push(
    generateSupplier('Combustibles del Norte', ['COMBUSTIBLE'], 'Bucaramanga'),
    generateSupplier('Estación de Servicio Petroandina', ['COMBUSTIBLE'], 'Bogotá'),
  );

  // LABORATORY AND TESTING
  suppliers.push(
    generateSupplier('Laboratorio de Suelos y Concretos', ['LABORATORIO', 'SERVICIOS'], 'Bogotá'),
    generateSupplier('Control de Calidad Ingenieros', ['LABORATORIO'], 'Medellín'),
  );

  // SERVICES
  suppliers.push(
    generateSupplier('Subcontratos y Obras Civiles', ['SERVICIOS'], 'Cali'),
    generateSupplier('Consultoría e Ingeniería Ltda.', ['SERVICIOS'], 'Bogotá'),
  );

  return suppliers;
}

/**
 * Pre-generated suppliers data
 */
export const SUPPLIERS = generateSuppliers();

/**
 * Get supplier by legal name
 * Exact match on supplier name field
 *
 * @param name - Supplier legal name, e.g., "Cementos Argos S.A."
 * @returns Supplier object if found, undefined otherwise
 *
 * @example
 * ```ts
 * const argos = getSupplierByName('Cementos Argos S.A.');
 * console.log(argos?.category); // ["CEMENTO", "HORMIGON"]
 * ```
 */
export function getSupplierByName(name: string): Supplier | undefined {
  return SUPPLIERS.find((supplier) => supplier.name === name);
}

/**
 * Get all suppliers that supply a specific material category
 * Suppliers can have multiple categories
 *
 * @param category - Material category, e.g., "CEMENTO"
 * @returns Array of suppliers with category, empty if none found
 *
 * @example
 * ```ts
 * const cementSuppliers = getSuppliersByCategory('CEMENTO');
 * console.log(cementSuppliers.length); // 4
 * console.log(cementSuppliers[0].name); // "Cementos Argos S.A."
 * ```
 */
export function getSuppliersByCategory(category: string): Supplier[] {
  return SUPPLIERS.filter((supplier) => supplier.category.includes(category));
}

/**
 * Get random supplier from all suppliers using seeded RNG
 * Deterministic - same supplier for same seed across calls
 *
 * @returns Random Supplier object from full catalog
 *
 * @example
 * ```ts
 * const supplier = getRandomSupplier();
 * console.log(supplier.name); // e.g., "Acerías Paz del Río"
 * console.log(supplier.reliability); // 75-98
 * ```
 */
export function getRandomSupplier(): Supplier {
  return rng.pick(SUPPLIERS);
}

/**
 * Get random supplier for specific category using seeded RNG
 * Throws if category has no suppliers
 *
 * @param category - Material category, e.g., "ACERO"
 * @returns Random Supplier in category, never undefined
 * @throws {Error} When category not found or has no suppliers
 *
 * @example
 * ```ts
 * const steelSupplier = getRandomSupplierByCategory('ACERO');
 * console.log(steelSupplier.category); // includes "ACERO"
 * ```
 */
export function getRandomSupplierByCategory(category: string): Supplier {
  const suppliers = getSuppliersByCategory(category);
  if (suppliers.length === 0) {
    throw new Error(`No suppliers found for category: ${category}`);
  }
  return rng.pick(suppliers);
}
