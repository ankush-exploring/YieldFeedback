import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export const maxDuration = 15;
export const dynamic = 'force-dynamic';

const FALLBACK_QUESTION_SETS = [
  "What's a project you're most proud of?||How do you prefer receiving constructive feedback?||What's one skill you're currently trying to master?",
  "What is one piece of advice that changed your life?||If you could master any skill overnight, what would it be?||What's a hobby you've recently picked up?",
  "What's something you're looking forward to this month?||What book, movie, or song has inspired you recently?||What is the best compliment you've ever received?",
  "What is one challenge you've overcome that made you stronger?||How do you recharge after a busy week?||What is your favorite way to spend a free day?",
  "What's one quality you admire most in your peers?||If you could solve one everyday problem with tech, what would it be?||What's a goal you're aiming to achieve this year?",
  "What do you think is your greatest strength?||What is something you're curious about right now?||What advice would you give to someone just starting out in your field?",
];

function getRandomFallback(): string {
  const index = Math.floor(Math.random() * FALLBACK_QUESTION_SETS.length);
  return FALLBACK_QUESTION_SETS[index];
}

function cleanSuggestions(raw: string): string | null {
  if (!raw) return null;
  let text = raw.trim();

  // Strip enclosing quotes if present
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    text = text.slice(1, -1).trim();
  }

  // Strip intro line like "Here are three questions:\n"
  const colonIndex = text.indexOf(':');
  if (colonIndex !== -1 && colonIndex < 40 && text.slice(0, colonIndex).toLowerCase().includes('question')) {
    const afterColon = text.slice(colonIndex + 1).trim();
    if (afterColon.includes('||')) {
      text = afterColon;
    }
  }

  const parts = text
    .split('||')
    .map((s) => s.trim().replace(/^["'\s]+|["'\s]+$/g, ''))
    .filter((s) => s.length > 5);

  if (parts.length >= 2) {
    return parts.slice(0, 3).join('||');
  }

  return null;
}

export async function POST() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn('[YieldFeedback AI] GROQ_API_KEY is not set. Using curated suggestions.');
    return new Response(getRandomFallback(), {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const configuredModel = process.env.GROQ_MODEL;
  // Build a prioritized list of models to try
  const modelsToTry: string[] = [];
  if (configuredModel && configuredModel !== 'llama-3.3-70b-versatile') {
    modelsToTry.push(configuredModel);
  }
  modelsToTry.push('openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b');

  const prompt =
    "Create exactly three open-ended, friendly, and engaging questions separated by '||'. Suitable for an anonymous feedback app like YieldFeedback. Output ONLY the three questions separated by '||', with no numbering, intro, or quotes. Example: What inspires you to do your best work?||How do you prefer receiving feedback?||What's a project you're currently excited about?";

  const groq = createGroq({ apiKey });

  for (const modelName of modelsToTry) {
    try {
      const { text } = await generateText({
        model: groq(modelName),
        prompt,
        abortSignal: AbortSignal.timeout(4000),
      });

      const cleaned = cleanSuggestions(text);
      if (cleaned) {
        return new Response(cleaned, {
          status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    } catch (err) {
      console.warn(
        `[YieldFeedback AI] Model ${modelName} failed:`,
        err instanceof Error ? err.message : err
      );
      // Continue to next model in the list
    }
  }

  // If all models failed or timed out, immediately return curated fallback
  console.warn('[YieldFeedback AI] All Groq models failed. Returning curated fallback questions.');
  return new Response(getRandomFallback(), {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
