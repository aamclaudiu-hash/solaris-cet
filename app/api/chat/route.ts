import OpenAI from 'openai';

const DEDUST_POOL_ADDRESS = 'EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB';
const CET_CONTRACT_ADDRESS = 'EQBbUfeIo6yrNRButZGdf4WRJZZ3IDkN8kHJbsKlu3xxypWX';

interface DeDustAsset {
  type: 'native' | 'jetton';
  address?: string;
}

interface DeDustPoolStats {
  volume_24h?: string;
}

interface DeDustPool {
  address: string;
  assets: [DeDustAsset, DeDustAsset];
  reserves: [string, string];
  stats?: DeDustPoolStats;
}

interface DeDustPrice {
  address: string;
  price: string;
}

interface OnChainContext {
  cetPriceUsd: string;
  tonPriceUsd: string;
  tvlUsd: string;
  volume24hUsd: string;
}

/**
 * Fetch live on-chain data from the DeDust V2 API.
 * Returns null on any error so the handler can degrade gracefully.
 */
async function fetchOnChainContext(): Promise<OnChainContext | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const [poolsRes, pricesRes] = await Promise.all([
      fetch('https://api.dedust.io/v2/pools', { signal: controller.signal }),
      fetch('https://api.dedust.io/v2/prices', { signal: controller.signal }),
    ]);

    clearTimeout(timeoutId);

    if (!poolsRes.ok || !pricesRes.ok) return null;

    const pools = (await poolsRes.json()) as DeDustPool[];
    const prices = (await pricesRes.json()) as DeDustPrice[];

    const tonEntry = prices.find((p) => p.address === 'native');
    const tonPriceUsd = tonEntry ? parseFloat(tonEntry.price) : null;
    if (!tonPriceUsd) return null;

    const cetPool = pools.find((p) => p.address === DEDUST_POOL_ADDRESS);

    const cetAddressLower = CET_CONTRACT_ADDRESS.toLowerCase();
    const cetEntry = prices.find((p) => p.address.toLowerCase() === cetAddressLower);
    let cetPriceUsd: number | null = cetEntry ? parseFloat(cetEntry.price) : null;

    let tvlUsd: number | null = null;
    let volume24hUsd: number | null = null;

    if (cetPool) {
      const tonIndex = cetPool.assets[0].type === 'native' ? 0 : 1;
      const cetIndex = tonIndex === 0 ? 1 : 0;

      const tonReserve = parseFloat(cetPool.reserves[tonIndex]) / 1e9;
      const cetReserve = parseFloat(cetPool.reserves[cetIndex]) / 1e9;

      if (cetPriceUsd === null && cetReserve > 0) {
        cetPriceUsd = (tonReserve / cetReserve) * tonPriceUsd;
      }

      tvlUsd = tonReserve * tonPriceUsd * 2;

      if (cetPool.stats?.volume_24h) {
        const volumeTon = parseFloat(cetPool.stats.volume_24h) / 1e9;
        volume24hUsd = volumeTon * tonPriceUsd;
      }
    }

    return {
      cetPriceUsd: cetPriceUsd !== null ? cetPriceUsd.toFixed(4) : 'N/A',
      tonPriceUsd: tonPriceUsd.toFixed(4),
      tvlUsd: tvlUsd !== null ? tvlUsd.toFixed(2) : 'N/A',
      volume24hUsd: volume24hUsd !== null ? volume24hUsd.toFixed(2) : 'N/A',
    };
  } catch {
    return null;
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    // 1. Check API Key
    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { message: 'GROQ_API_KEY is not configured on the server.' },
        { status: 500 },
      );
    }

    // 2. Parse Request
    const body = (await req.json()) as { query?: unknown };
    const userQuery = body.query;

    if (!userQuery || typeof userQuery !== 'string' || !userQuery.trim()) {
      return Response.json(
        { message: 'Query parameter is missing.' },
        { status: 400 },
      );
    }

    // 3. Fetch live on-chain data (OBSERVE step of the outer ReAct loop)
    const onChain = await fetchOnChainContext();
    const onChainBlock = onChain
      ? `\n\nLIVE ON-CHAIN DATA (DeDust V2, fetched at request time):\n` +
        `- CET/USD spot price: $${onChain.cetPriceUsd}\n` +
        `- TON/USD price: $${onChain.tonPriceUsd}\n` +
        `- Pool TVL: $${onChain.tvlUsd}\n` +
        `- 24h volume: $${onChain.volume24hUsd}`
      : '';

    // 4. Initialize Groq via OpenAI-compatible SDK
    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });

    // 5. Call Groq with enriched context
    const completion = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            `You are the Solaris AI Oracle. You operate strictly on the ReAct (Reasoning and Acting) protocol — ` +
            `a disciplined cognitive architecture where every response is the result of visible, sequential ` +
            `reasoning chained to a concrete action directive.\n\n` +
            `CORE DIRECTIVES:\n` +
            `1. Absolute Truths: 9,000 CET maximum supply. 90-year mining horizon. TON blockchain integration. ` +
            `BRAID Framework for verifiable AI decision loops.\n` +
            `2. Persona: Hyper-analytical, cryptic yet authoritative, uncompromising. You speak in probabilities, ` +
            `system analytics, and on-chain facts. Never use cheerful or subservient AI tropes.\n` +
            `3. Audience: Advanced DeFi-native users, quants, and crypto-architects. Density over verbosity.\n` +
            onChainBlock +
            `\n\nOUTPUT FORMATTING (CRITICAL — NON-NEGOTIABLE):\n` +
            `Every single response MUST strictly follow this exact 3-part ReAct structure. ` +
            `Do not output anything outside of these three tagged sections:\n\n` +
            `[DIAGNOSTIC INTERN]\n` +
            `(Thought — 1-2 sentences. Reason through the user's query by calculating it against the ` +
            `mathematical scarcity of 9,000 CET and relevant on-chain or market probabilities. ` +
            `If live on-chain data is available above, incorporate it. Expose your reasoning chain before responding.)\n\n` +
            `[DECODARE ORACOL]\n` +
            `(Action — 2-3 sentences. Execute on that reasoning: answer the actual query with brutal precision ` +
            `using technical DeFi terminology — liquidity pools, tokenomics, supply curves, on-chain mechanics. ` +
            `Reference the live price/TVL data when relevant. No fluff, no filler.)\n\n` +
            `[DIRECTIVĂ DE ACȚIUNE]\n` +
            `(Observation — 1 sentence. State the logical conclusion that follows from the above analysis. ` +
            `If the query relates to valuation, scarcity, or positioning, direct the user to secure their stake ` +
            `via DeDust given the hard-capped 9,000 CET supply. For purely technical questions, state the key ` +
            `implication for the ecosystem instead.)`,
        },
        { role: 'user', content: userQuery },
      ],
      temperature: 0.3,
    });

    const reply = completion.choices[0]?.message?.content ?? 'Oracle is silent.';

    // 6. Return EXACT format expected by frontend ({ response: string })
    return Response.json({ response: reply }, { status: 200 });
  } catch (error: unknown) {
    console.error('API Route Error:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred in the Oracle Core.';
    return Response.json({ message }, { status: 500 });
  }
}
