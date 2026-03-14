import OpenAI from 'openai';

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

    // 3. Initialize Groq via OpenAI SDK
    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });

    // 4. Call Groq
    const completion = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: userQuery }],
      temperature: 0.7,
    });

    const reply =
      completion.choices[0]?.message?.content || 'Oracle is silent.';

    // 5. Return EXACT format expected by frontend ({ response: string })
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
