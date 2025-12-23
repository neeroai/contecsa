/**
 * AI SDK v6 + Vercel AI Gateway Configuration
 *
 * AI Gateway handles provider proxy:
 * - Primary: Gemini (gemini-2.0-flash-exp)
 * - Fallback: DeepSeek (configured in AI Gateway dashboard)
 *
 * NO need for @ai-sdk/google - AI Gateway is default provider
 */

export const aiConfig = {
  // Using AI Gateway - model as string (default provider)
  defaultModel: 'gemini-2.0-flash-exp',

  // Model configuration
  temperature: 0.7,
  maxTokens: 2048,
};

export default aiConfig;
