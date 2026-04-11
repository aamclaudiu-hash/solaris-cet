import { TonClient } from '@ton/ton';
import { Address } from '@ton/core';

let client: TonClient | null = null;

export function parseTonAddress(raw: string): Address | null {
  const v = raw.trim();
  if (!v) return null;
  try {
    return Address.parse(v);
  } catch {
    try {
      return Address.parseFriendly(v).address;
    } catch {
      return null;
    }
  }
}

export function getTonClient(): TonClient | null {
  if (client) return client;
  const endpoint = process.env.TONCENTER_RPC_URL?.trim();
  if (!endpoint) return null;
  const apiKey = process.env.TONCENTER_API_KEY?.trim();
  client = new TonClient({ endpoint, apiKey });
  return client;
}

