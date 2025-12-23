import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import { aiConfig } from '@/lib/ai/config';

/**
 * Smoke test endpoint - AI SDK v6 + AI Gateway
 * DELETE after verification
 */
export async function GET() {
  try {
    // AI Gateway auto-handles provider routing
    const { text } = await generateText({
      model: aiConfig.defaultModel,  // 'gemini-2.0-flash-exp'
      prompt: 'Say "AI SDK v6 working" in Spanish',
      temperature: aiConfig.temperature,
    });

    return NextResponse.json({
      success: true,
      response: text,
      version: 'ai-sdk-v6-with-ai-gateway',
      model: aiConfig.defaultModel
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
