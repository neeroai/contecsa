/**
 * Suppliers Data Generator
 * Contecsa Sistema de Inteligencia de Datos
 *
 * Version: 1.0 | Date: 2025-12-24 13:00
 *
 * Generates 20+ construction suppliers with realistic Colombian data.
 * Includes major suppliers: Argos, Cemex, Holcim, etc.
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
 * Generate a single supplier
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
 * Generates all suppliers
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
 * Helper: Get supplier by name
 */
export function getSupplierByName(name: string): Supplier | undefined {
  return SUPPLIERS.find((supplier) => supplier.name === name);
}

/**
 * Helper: Get suppliers by category
 */
export function getSuppliersByCategory(category: string): Supplier[] {
  return SUPPLIERS.filter((supplier) => supplier.category.includes(category));
}

/**
 * Helper: Get random supplier
 */
export function getRandomSupplier(): Supplier {
  return rng.pick(SUPPLIERS);
}

/**
 * Helper: Get random supplier by category
 */
export function getRandomSupplierByCategory(category: string): Supplier {
  const suppliers = getSuppliersByCategory(category);
  if (suppliers.length === 0) {
    throw new Error(`No suppliers found for category: ${category}`);
  }
  return rng.pick(suppliers);
}
