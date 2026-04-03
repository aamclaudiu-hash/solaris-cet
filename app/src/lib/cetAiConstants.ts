/**
 * Max characters for a single CET AI user query (UI + Edge `/api/chat`).
 * Keep in sync with repository root `api/chat/route.ts` (OpenAI fallback).
 */
export const CET_AI_MAX_QUERY_CHARS = 8000 as const;
