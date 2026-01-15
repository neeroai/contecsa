/**
 * @file Generator Utilities
 * @description Funciones compartidas para generación determinística de datos y helpers colombianos
 * @module lib/mockup-data/generators/utils
 * @exports rng, deterministicUUID, generateNIT, generatePhone, generateAddress, COLOMBIAN_CITIES, COLOMBIAN_FIRST_NAMES, COLOMBIAN_LAST_NAMES, generateName, generateEmail, addDays, addMonths, subtractDays, subtractMonths, formatDate, formatMonth, getCurrentDate, daysBetween, randomDate, formatCurrency, generatePONumber, generateInvoiceNumber, calculateStats, calculateZScore, SeededRandom
 */

// Note: randomUUID not needed as we use deterministic UUIDs

/**
 * Seeded pseudorandom number generator for deterministic mockup data
 * Uses seed-based algorithm for consistent output across runs
 * Methods: next() [0-1], int(), float(), boolean(), pick(), pickN(), shuffle()
 *
 * @example
 * ```ts
 * const rng = new SeededRandom(42);
 * console.log(rng.int(1, 100)); // Same value every time with seed 42
 * ```
 */
class SeededRandom {
  private seed: number;

  /**
   * Creates seeded RNG instance with initial seed value
   *
   * @param seed - Seed number, defaults to 12345 for consistency
   *
   * @example
   * ```ts
   * const rng = new SeededRandom(42);
   * ```
   */
  constructor(seed = 12345) {
    this.seed = seed;
  }

  /**
   * Get next pseudo-random number using seeded algorithm
   * Returns value between 0 and 1 for use in other methods
   *
   * @returns Pseudo-random number in range [0, 1)
   */
  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Get random integer between min and max (inclusive on both ends)
   *
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @returns Random integer in range [min, max]
   */
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Get random floating point number between min and max
   *
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (exclusive)
   * @returns Random float in range [min, max)
   */
  float(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Get random boolean with optional probability of true
   *
   * @param probability - Probability of true, default 0.5 (50%)
   * @returns Random boolean
   */
  boolean(probability = 0.5): boolean {
    return this.next() < probability;
  }

  /**
   * Get random element from array
   *
   * @param array - Array to pick from
   * @returns Random element from array
   */
  pick<T>(array: readonly T[]): T {
    return array[this.int(0, array.length - 1)];
  }

  /**
   * Get n random elements from array without duplicates
   *
   * @param array - Array to pick from
   * @param n - Number of elements to pick, max array.length
   * @returns Array of n unique random elements, or fewer if array too small
   */
  pickN<T>(array: readonly T[], n: number): T[] {
    const shuffled = [...array].sort(() => this.next() - 0.5);
    return shuffled.slice(0, Math.min(n, array.length));
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   *
   * @param array - Array to shuffle
   * @returns Shuffled array (new array, original unchanged)
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
 * Global seeded RNG instance used by all generator functions
 * Seeded with 42 for consistent mockup data across sessions
 * All data generation relies on this instance for determinism
 *
 * @example
 * ```ts
 * import { rng, generateName } from './utils';
 * const name = generateName(); // Uses rng internally
 * const city = rng.pick(COLOMBIAN_CITIES); // Direct RNG access
 * ```
 */
export const rng = new SeededRandom(42);

/**
 * Generate deterministic UUID from seed string (not RFC 4122 compliant)
 * Same seed always produces same UUID for consistent test data
 *
 * @param seed - Seed string, e.g., "user-123" or "material-CEM-001"
 * @returns UUID-format string (deterministic based on seed)
 *
 * @example
 * ```ts
 * const id1 = deterministicUUID('user-compras-liced');
 * const id2 = deterministicUUID('user-compras-liced');
 * console.log(id1 === id2); // true - same seed, same UUID
 * ```
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
 * Generate random Colombian NIT (tax ID)
 * Format: XXXXXXXXX-D (9 digits + check digit)
 *
 * @returns Colombian NIT string, e.g., "900123456-7"
 *
 * @example
 * ```ts
 * const nit = generateNIT();
 * console.log(nit); // "912345678-3"
 * ```
 */
export function generateNIT(): string {
  const base = rng.int(800000000, 999999999);
  const checkDigit = base % 10;
  return `${base}-${checkDigit}`;
}

/**
 * Generates a Colombian phone number in E.164 format
 * Mobile: +57 3XX XXX XXXX | Landline: +57 X XXX XXXX
 *
 * @param mobile - Generate mobile (true) or landline (false), default true
 * @returns Colombian phone number string
 *
 * @example
 * ```ts
 * const mobile = generatePhone(true);
 * console.log(mobile); // "+57 312 345 6789"
 * const landline = generatePhone(false);
 * console.log(landline); // "+57 1 234 5678"
 * ```
 */
export function generatePhone(mobile = true): string {
  if (mobile) {
    return `+57 3${rng.int(10, 99)} ${rng.int(100, 999)} ${rng.int(1000, 9999)}`;
  } else {
    return `+57 ${rng.int(1, 8)} ${rng.int(100, 999)} ${rng.int(1000, 9999)}`;
  }
}

/**
 * Generates a Colombian street address in standard format
 * Format: [StreetType] [num1] # [num2]-[num3]
 *
 * @returns Colombian address string with street, cross street, and number
 *
 * @example
 * ```ts
 * const address = generateAddress();
 * console.log(address); // "Carrera 45 # 23-12"
 * ```
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
 * Major Colombian cities for realistic location data generation
 * 15 cities: Bogotá, Medellín, Cali, Barranquilla, Cartagena, and 10 others
 *
 * @example
 * ```ts
 * const city = rng.pick(COLOMBIAN_CITIES);
 * console.log(city); // "Bogotá"
 * console.log(COLOMBIAN_CITIES.length); // 15
 * ```
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
 * Common Colombian first names for realistic person data generation
 * 30 names: Carlos, María, José, Ana, and 26 others including Liced
 *
 * @example
 * ```ts
 * const firstName = rng.pick(COLOMBIAN_FIRST_NAMES);
 * console.log(firstName); // "Carlos"
 * console.log(COLOMBIAN_FIRST_NAMES.length); // 30
 * ```
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
 * Common Colombian last names for realistic person data generation
 * 20 names: Rodríguez, García, González, Martínez, López, and 15 others
 *
 * @example
 * ```ts
 * const lastName = rng.pick(COLOMBIAN_LAST_NAMES);
 * console.log(lastName); // "Rodríguez"
 * console.log(COLOMBIAN_LAST_NAMES.length); // 20
 * ```
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
 * Generates a random full Colombian name using seeded RNG
 * Combines random first name and last name from Colombian name lists
 *
 * @returns Object with firstName and lastName strings, deterministic per seed
 *
 * @example
 * ```ts
 * const name = generateName();
 * console.log(name); // { firstName: "Carlos", lastName: "Rodríguez" }
 * ```
 */
export function generateName(): { firstName: string; lastName: string } {
  return {
    firstName: rng.pick(COLOMBIAN_FIRST_NAMES),
    lastName: rng.pick(COLOMBIAN_LAST_NAMES),
  };
}

/**
 * Generates email address from name with accent removal and normalization
 * Removes diacritics (á→a) and lowercases for valid email format
 *
 * @param firstName - First name, accent removal applied (e.g., "José" → "jose")
 * @param lastName - Last name, accent removal applied (e.g., "García" → "garcia")
 * @param domain - Email domain, defaults to "contecsa.com"
 * @returns Formatted email as firstname.lastname@domain
 *
 * @example
 * ```ts
 * const email = generateEmail("José", "García");
 * console.log(email); // "jose.garcia@contecsa.com"
 * ```
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
 * Adds days to a date, returning new Date without mutation
 *
 * @param date - Base date to modify
 * @param days - Number of days to add (negative to subtract)
 * @returns New Date object with days added
 *
 * @example
 * ```ts
 * const today = new Date('2025-12-24');
 * const nextWeek = addDays(today, 7);
 * console.log(nextWeek); // 2025-12-31
 * ```
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Adds months to a date, returning new Date without mutation
 *
 * @param date - Base date to modify
 * @param months - Number of months to add (negative to subtract)
 * @returns New Date object with months added
 *
 * @example
 * ```ts
 * const today = new Date('2025-12-24');
 * const nextMonth = addMonths(today, 1);
 * console.log(nextMonth); // 2026-01-24
 * ```
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Subtracts days from a date, returning new Date without mutation
 * Convenience wrapper around addDays with negative value
 *
 * @param date - Base date to modify
 * @param days - Number of days to subtract
 * @returns New Date object with days subtracted
 *
 * @example
 * ```ts
 * const today = new Date('2025-12-24');
 * const lastWeek = subtractDays(today, 7);
 * console.log(lastWeek); // 2025-12-17
 * ```
 */
export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

/**
 * Subtracts months from a date, returning new Date without mutation
 * Convenience wrapper around addMonths with negative value
 *
 * @param date - Base date to modify
 * @param months - Number of months to subtract
 * @returns New Date object with months subtracted
 *
 * @example
 * ```ts
 * const today = new Date('2025-12-24');
 * const lastMonth = subtractMonths(today, 1);
 * console.log(lastMonth); // 2025-11-24
 * ```
 */
export function subtractMonths(date: Date, months: number): Date {
  return addMonths(date, -months);
}

/**
 * Formats date to ISO 8601 date string (YYYY-MM-DD)
 * Uses ISO format for consistent international date representation
 *
 * @param date - Date object to format
 * @returns ISO date string format (e.g., "2025-12-24")
 *
 * @example
 * ```ts
 * const date = new Date('2025-12-24T15:30:00Z');
 * const formatted = formatDate(date);
 * console.log(formatted); // "2025-12-24"
 * ```
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Formats date to ISO 8601 month string (YYYY-MM)
 * Strips day component for month-level reporting
 *
 * @param date - Date object to format
 * @returns ISO month string format (e.g., "2025-12")
 *
 * @example
 * ```ts
 * const date = new Date('2025-12-24T15:30:00Z');
 * const formatted = formatMonth(date);
 * console.log(formatted); // "2025-12"
 * ```
 */
export function formatMonth(date: Date): string {
  return date.toISOString().slice(0, 7);
}

/**
 * Returns fixed current date for deterministic mockup generation
 * Always returns 2025-12-24 for consistent test data across runs
 *
 * @returns Fixed Date object: 2025-12-24 00:00:00 UTC
 *
 * @example
 * ```ts
 * const now = getCurrentDate();
 * console.log(formatDate(now)); // "2025-12-24"
 * ```
 */
export function getCurrentDate(): Date {
  return new Date('2025-12-24T00:00:00Z');
}

/**
 * Calculates absolute days between two dates
 * Result is always positive (direction-independent)
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of complete days between dates (ignores time component)
 *
 * @example
 * ```ts
 * const d1 = new Date('2025-12-24');
 * const d2 = new Date('2025-12-31');
 * console.log(daysBetween(d1, d2)); // 7
 * console.log(daysBetween(d2, d1)); // 7 (same result)
 * ```
 */
export function daysBetween(date1: Date, date2: Date): number {
  const diff = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Generates random date between start and end using seeded RNG
 * Result is deterministic based on global seeded random instance
 *
 * @param start - Start date (inclusive)
 * @param end - End date (inclusive)
 * @returns Random Date between start and end
 *
 * @example
 * ```ts
 * const start = new Date('2025-01-01');
 * const end = new Date('2025-12-31');
 * const random = randomDate(start, end);
 * console.log(random); // e.g., 2025-06-15T14:23:45.123Z
 * ```
 */
export function randomDate(start: Date, end: Date): Date {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + rng.next() * (endTime - startTime);
  return new Date(randomTime);
}

/**
 * Formats amount as currency string with locale-specific formatting
 * COP: Colombian Peso with $ prefix | Others: Intl.NumberFormat with symbol
 *
 * @param amount - Numeric amount to format
 * @param currency - ISO 4217 code, defaults to "COP" (Colombian Peso)
 * @returns Formatted currency string (e.g., "$1,234,567" or "USD 1,234.57")
 *
 * @example
 * ```ts
 * console.log(formatCurrency(1234567)); // "$1,234,567"
 * console.log(formatCurrency(1000.50, "USD")); // "USD 1,000.50"
 * ```
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
 * Generates purchase order number in standard format
 * Format: PO-YYYYMMDD-XXX (3-digit zero-padded sequence)
 *
 * @param date - Date for YYYYMMDD component
 * @param sequence - Sequence number (e.g., 1-999)
 * @returns PO number string (e.g., "PO-20251224-001")
 *
 * @example
 * ```ts
 * const po = generatePONumber(new Date('2025-12-24'), 42);
 * console.log(po); // "PO-20251224-042"
 * ```
 */
export function generatePONumber(date: Date, sequence: number): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const seq = String(sequence).padStart(3, '0');
  return `PO-${year}${month}${day}-${seq}`;
}

/**
 * Generates invoice number in standard format
 * Format: INV-YYYYMMDD-XXX (3-digit zero-padded sequence)
 *
 * @param date - Date for YYYYMMDD component
 * @param sequence - Sequence number (e.g., 1-999)
 * @returns Invoice number string (e.g., "INV-20251224-001")
 *
 * @example
 * ```ts
 * const inv = generateInvoiceNumber(new Date('2025-12-24'), 42);
 * console.log(inv); // "INV-20251224-042"
 * ```
 */
export function generateInvoiceNumber(date: Date, sequence: number): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const seq = String(sequence).padStart(3, '0');
  return `INV-${year}${month}${day}-${seq}`;
}

/**
 * Calculates mean, median, std dev, min, max for price anomaly detection
 * Returns zeros if empty array for safe chaining
 *
 * @param values - Array of numeric values (prices)
 * @returns Object with mean, median, stdDev, min, max statistics
 *
 * @example
 * ```ts
 * const stats = calculateStats([100, 200, 300, 400, 500]);
 * console.log(stats.mean); // 300
 * console.log(stats.median); // 300
 * console.log(stats.stdDev); // ~141.42
 * ```
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
 * Calculates Z-score to detect price anomalies (statistical outliers)
 * Returns 0 if stdDev is 0 to prevent division by zero
 *
 * @param value - Single value to test
 * @param mean - Population mean
 * @param stdDev - Population standard deviation
 * @returns Z-score: how many std devs from mean (>2 is anomaly)
 *
 * @example
 * ```ts
 * const zscore = calculateZScore(500, 300, 141.42);
 * console.log(zscore); // ~1.41 (within 2 stddev, normal)
 * ```
 */
export function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
}
