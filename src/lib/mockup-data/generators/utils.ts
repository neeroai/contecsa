/**
 * Generator Utilities
 * Contecsa Sistema de Inteligencia de Datos
 *
 * Version: 1.0 | Date: 2025-12-24 13:00
 *
 * Shared utility functions for data generation.
 * Provides deterministic random selection and Colombian data helpers.
 */

// Note: randomUUID not needed as we use deterministic UUIDs

/**
 * Seeded random number generator for deterministic output
 */
class SeededRandom {
  private seed: number;

  constructor(seed = 12345) {
    this.seed = seed;
  }

  /**
   * Returns a pseudo-random number between 0 and 1
   */
  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   */
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Returns a random float between min and max
   */
  float(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Returns a random boolean with optional probability
   */
  boolean(probability = 0.5): boolean {
    return this.next() < probability;
  }

  /**
   * Returns a random element from an array
   */
  pick<T>(array: readonly T[]): T {
    return array[this.int(0, array.length - 1)];
  }

  /**
   * Returns n random elements from an array (no duplicates)
   */
  pickN<T>(array: readonly T[], n: number): T[] {
    const shuffled = [...array].sort(() => this.next() - 0.5);
    return shuffled.slice(0, Math.min(n, array.length));
  }

  /**
   * Shuffles an array in place
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

/**
 * Global seeded random instance (deterministic)
 */
export const rng = new SeededRandom(42);

/**
 * Generates a deterministic UUID based on a seed string
 */
export function deterministicUUID(seed: string): string {
  // Create a simple hash from the seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert hash to UUID format
  const hex = Math.abs(hash).toString(16).padStart(32, '0');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

/**
 * Generates a Colombian NIT (tax ID)
 * Format: 123456789-0
 */
export function generateNIT(): string {
  const base = rng.int(800000000, 999999999);
  const checkDigit = base % 10;
  return `${base}-${checkDigit}`;
}

/**
 * Generates a Colombian phone number
 * Format: +57 3XX XXX XXXX (mobile) or +57 X XXX XXXX (landline)
 */
export function generatePhone(mobile = true): string {
  if (mobile) {
    return `+57 3${rng.int(10, 99)} ${rng.int(100, 999)} ${rng.int(1000, 9999)}`;
  } else {
    return `+57 ${rng.int(1, 8)} ${rng.int(100, 999)} ${rng.int(1000, 9999)}`;
  }
}

/**
 * Generates a Colombian address
 */
export function generateAddress(): string {
  const streetTypes = ['Calle', 'Carrera', 'Avenida', 'Diagonal', 'Transversal'];
  const streetType = rng.pick(streetTypes);
  const number1 = rng.int(1, 200);
  const number2 = rng.int(1, 99);
  const number3 = rng.int(1, 200);

  return `${streetType} ${number1} # ${number2}-${number3}`;
}

/**
 * Colombian cities
 */
export const COLOMBIAN_CITIES = [
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Cúcuta',
  'Bucaramanga',
  'Pereira',
  'Santa Marta',
  'Ibagué',
  'Pasto',
  'Manizales',
  'Neiva',
  'Villavicencio',
  'Armenia',
] as const;

/**
 * Colombian first names
 */
export const COLOMBIAN_FIRST_NAMES = [
  'Carlos',
  'María',
  'José',
  'Ana',
  'Luis',
  'Carmen',
  'Jorge',
  'Laura',
  'Miguel',
  'Diana',
  'Andrés',
  'Claudia',
  'Fernando',
  'Patricia',
  'Ricardo',
  'Sandra',
  'Pedro',
  'Mónica',
  'Javier',
  'Liced',
  'Santiago',
  'Valentina',
  'Sebastián',
  'Catalina',
  'Daniel',
  'Juliana',
  'Alejandro',
  'Natalia',
  'Camilo',
  'Andrea',
] as const;

/**
 * Colombian last names
 */
export const COLOMBIAN_LAST_NAMES = [
  'Rodríguez',
  'García',
  'González',
  'Martínez',
  'López',
  'Hernández',
  'Pérez',
  'Sánchez',
  'Ramírez',
  'Torres',
  'Vega',
  'Díaz',
  'Vargas',
  'Castro',
  'Romero',
  'Moreno',
  'Ruiz',
  'Gómez',
  'Álvarez',
  'Jiménez',
] as const;

/**
 * Generates a full Colombian name
 */
export function generateName(): { firstName: string; lastName: string } {
  return {
    firstName: rng.pick(COLOMBIAN_FIRST_NAMES),
    lastName: rng.pick(COLOMBIAN_LAST_NAMES),
  };
}

/**
 * Generates an email from a name
 */
export function generateEmail(
  firstName: string,
  lastName: string,
  domain = 'contecsa.com',
): string {
  const cleanFirst = firstName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const cleanLast = lastName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return `${cleanFirst}.${cleanLast}@${domain}`;
}

/**
 * Date manipulation helpers
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

export function subtractMonths(date: Date, months: number): Date {
  return addMonths(date, -months);
}

/**
 * Formats a date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Formats a date to YYYY-MM
 */
export function formatMonth(date: Date): string {
  return date.toISOString().slice(0, 7);
}

/**
 * Returns current date for mockup (fixed for deterministic output)
 */
export function getCurrentDate(): Date {
  return new Date('2025-12-24T00:00:00Z');
}

/**
 * Calculates days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const diff = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Generates a random date between two dates
 */
export function randomDate(start: Date, end: Date): Date {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + rng.next() * (endTime - startTime);
  return new Date(randomTime);
}

/**
 * Currency formatting
 */
export function formatCurrency(amount: number, currency = 'COP'): string {
  if (currency === 'COP') {
    return `$${Math.round(amount).toLocaleString('es-CO')}`;
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Generates a PO number
 * Format: PO-YYYYMMDD-XXX
 */
export function generatePONumber(date: Date, sequence: number): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const seq = String(sequence).padStart(3, '0');
  return `PO-${year}${month}${day}-${seq}`;
}

/**
 * Generates an invoice number
 * Format: INV-YYYYMMDD-XXX
 */
export function generateInvoiceNumber(date: Date, sequence: number): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const seq = String(sequence).padStart(3, '0');
  return `INV-${year}${month}${day}-${seq}`;
}

/**
 * Calculates statistical metrics for price analysis
 */
export function calculateStats(values: number[]): {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
} {
  if (values.length === 0) {
    return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean,
    median,
    stdDev,
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
}

/**
 * Calculates Z-score for anomaly detection
 */
export function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
}
