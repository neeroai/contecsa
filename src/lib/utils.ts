/**
 * @file CSS Class Utilities
 * @description Combina clases CSS con Tailwind merge para evitar conflictos
 * @module lib/utils
 * @exports cn
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper override resolution
 * Combines clsx for conditional classes with twMerge to handle precedence
 *
 * @param inputs - Class strings, objects, or arrays (may have conflicts)
 * @returns Merged class string with conflicts resolved
 *
 * @example
 * ```ts
 * cn('px-2 py-2', 'px-4') // 'py-2 px-4' (px-4 overrides px-2)
 * cn('text-red-500', 'text-blue-500') // 'text-blue-500'
 * cn('flex', { 'gap-2': true, 'gap-4': false }) // 'flex gap-2'
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
