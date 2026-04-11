import { getAllowedOrigin } from '../lib/cors';

export const config = { runtime: 'edge' };

function jsonResponse(body: unknown, allowedOrigin: string, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigin,
      'Vary': 'Origin',
      'Cache-Control': 'no-store',
    },
  });
}

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin');
  const allowedOrigin = getAllowedOrigin(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Vary': 'Origin',
      },
    });
  }

  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, allowedOrigin, 405);
  }

  const hasDbUrl = Boolean(process.env.DATABASE_URL?.trim());
  const hasEncSecret = Boolean(process.env.ENCRYPTION_SECRET?.trim());
  const hasGrokPlain = Boolean(process.env.GROK_API_KEY?.trim());
  const hasGrokEnc = Boolean(process.env.GROK_API_KEY_ENC?.trim());
  const hasGeminiPlain = Boolean(process.env.GEMINI_API_KEY?.trim());
  const hasGeminiEnc = Boolean(process.env.GEMINI_API_KEY_ENC?.trim());
  const hasTonRpcUrl = Boolean(process.env.TONCENTER_RPC_URL?.trim());
  const hasTonApiKey = Boolean(process.env.TONCENTER_API_KEY?.trim());

  const dbConfigured = hasDbUrl;
  const aiConfigured = Boolean(
    (hasGrokPlain || (hasGrokEnc && hasEncSecret)) && (hasGeminiPlain || (hasGeminiEnc && hasEncSecret)),
  );
  const tonConfigured = hasTonRpcUrl;

  return jsonResponse(
    {
      status: 'ok',
      checks: {
        db: dbConfigured ? 'configured' : 'missing',
        ai: aiConfigured ? 'configured' : 'missing',
        ton: tonConfigured ? 'configured' : 'missing',
      },
      env: {
        db: { databaseUrl: hasDbUrl },
        ai: {
          grokKey: hasGrokPlain,
          grokKeyEnc: hasGrokEnc,
          geminiKey: hasGeminiPlain,
          geminiKeyEnc: hasGeminiEnc,
          encryptionSecret: hasEncSecret,
        },
        ton: {
          rpcUrl: hasTonRpcUrl,
          apiKey: hasTonApiKey,
        },
      },
      time: new Date().toISOString(),
    },
    allowedOrigin,
  );
}
