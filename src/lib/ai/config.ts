/**
 * @file AI Model Configuration
 * @description Configuración de Vercel AI Gateway con Gemini 2.0 Flash como proveedor primario
 * @module lib/ai/config
 * @exports aiConfig
 */

/**
 * AI Gateway and model configuration for Gemini 2.0 Flash
 * Configure model name, temperature (creativity), and token limits for responses
 *
 * @example
 * ```ts
 * import { aiConfig } from '@/lib/ai/config';
 *
 * const response = await generateText({
 *   model: aiConfig.defaultModel,
 *   temperature: aiConfig.temperature,
 *   maxTokens: aiConfig.maxTokens,
 *   prompt: 'Analyze this purchase order...'
 * });
 * ```
 */
export const aiConfig = {
  // Using AI Gateway - model as string (default provider)
  defaultModel: 'gemini-2.0-flash-exp',

  // Model configuration
  temperature: 0.7,
  maxTokens: 2048,
};

export default aiConfig;
