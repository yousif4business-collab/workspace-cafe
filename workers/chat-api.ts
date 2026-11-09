type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const MAX_BODY_BYTES = 32_768;
const MAX_MESSAGE_LENGTH = 1_000;
const MAX_HISTORY = 8;
const MAX_HISTORY_CHARACTERS = 6_000;
const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Referrer-Policy': 'no-referrer',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
};

const SYSTEM_PROMPT = `You are the WorkSpace Baghdad website assistant. Help visitors with the cafe, rooftop padel club, sixth-floor meeting room, and Business Suites.
Known facts: the cafe and business operate in Hay Al-Jamia, Baghdad; opening hours are Saturday through Thursday, 9 AM to 5 PM; padel court rental is 60,000 IQD per hour; the sixth-floor meeting room is 25,000 IQD per hour; WhatsApp contact is +964 777 700 7839.
Answer in the language used by the visitor (English or Arabic). Be concise and friendly. Do not invent availability, menu stock, prices, amenities, or policies. If you do not know a detail, say so and direct the visitor to WhatsApp at https://wa.me/9647777007839.`;

const jsonResponse = (body: { answer?: string; error?: string }, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...SECURITY_HEADERS,
    },
  });

async function readLimitedBody(request: Request): Promise<{ ok: true; value: unknown } | { ok: false; tooLarge: boolean }> {
  const contentLength = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return { ok: false, tooLarge: true };
  }

  if (!request.body) return { ok: false, tooLarge: false };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      return { ok: false, tooLarge: true };
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(bytes)) as unknown };
  } catch {
    return { ok: false, tooLarge: false };
  }
}

function isChatMessage(value: unknown): value is ChatMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'role' in value &&
    (value.role === 'user' || value.role === 'assistant') &&
    'content' in value &&
    typeof value.content === 'string' &&
    value.content.trim().length > 0 &&
    value.content.length <= MAX_MESSAGE_LENGTH
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== '/api/chat') return jsonResponse({ error: 'Not found.' }, 404);
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed.' }, 405);
    }

    const origin = request.headers.get('Origin');
    if (origin && origin !== url.origin) {
      return jsonResponse({ error: 'Forbidden' }, 403);
    }

    const { success } = await env.CHAT_RATE_LIMIT.limit({
      key: request.headers.get('CF-Connecting-IP') ?? 'unknown',
    });
    if (!success) {
      return jsonResponse({ error: 'Too many requests. Please try again shortly.' }, 429);
    }

    const contentType = request.headers.get('Content-Type')?.split(';', 1)[0].trim().toLowerCase();
    if (contentType !== 'application/json') {
      return jsonResponse({ error: 'Content-Type must be application/json.' }, 415);
    }

    const parsed = await readLimitedBody(request);
    if (!parsed.ok) {
      return jsonResponse(
        { error: parsed.tooLarge ? 'Request is too large.' : 'Invalid JSON request.' },
        parsed.tooLarge ? 413 : 400,
      );
    }

    if (
      typeof parsed.value !== 'object' ||
      parsed.value === null ||
      !('messages' in parsed.value) ||
      !Array.isArray(parsed.value.messages) ||
      parsed.value.messages.length === 0 ||
      parsed.value.messages.length > MAX_HISTORY ||
      !parsed.value.messages.every(isChatMessage) ||
      parsed.value.messages.at(-1)?.role !== 'user' ||
      parsed.value.messages.reduce((total, message) => total + message.content.length, 0) > MAX_HISTORY_CHARACTERS
    ) {
      return jsonResponse({ error: 'Invalid chat messages.' }, 400);
    }

    try {
      const result = await env.AI.run(MODEL, {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...parsed.value.messages,
        ],
        max_tokens: 256,
        temperature: 0.3,
      });

      const answer =
        typeof result === 'string'
          ? result
          : typeof result === 'object' && result !== null && 'response' in result && typeof result.response === 'string'
            ? result.response
            : '';
      if (!answer.trim()) {
        throw new Error('Workers AI returned an empty response');
      }

      return jsonResponse({ answer });
    } catch (error) {
      console.error(JSON.stringify({
        message: 'Workers AI chat request failed',
        error: error instanceof Error ? error.message : String(error),
      }));
      return jsonResponse({ error: 'Chat is temporarily unavailable.' }, 503);
    }
  },
} satisfies ExportedHandler<Env>;
