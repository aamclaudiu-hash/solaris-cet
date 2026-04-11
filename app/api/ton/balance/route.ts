export const config = { runtime: 'nodejs' };

import { getAllowedOrigin } from '../../lib/cors';
import { CET_JETTON_MASTER_ADDRESS } from '../../../src/constants/token';
import { getTonClient, parseTonAddress } from '../../lib/ton';
import { JettonMaster, JettonWallet } from '@ton/ton';

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
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        Vary: 'Origin',
      },
    });
  }

  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, allowedOrigin, 405);
  }

  const url = new URL(req.url);
  const addressParam = url.searchParams.get('address') ?? '';
  const address = parseTonAddress(addressParam);
  if (!address) {
    return jsonResponse({ ok: false, error: 'Invalid address' }, allowedOrigin, 400);
  }

  const client = getTonClient();
  if (!client) {
    return jsonResponse({ ok: false, error: 'TON not configured' }, allowedOrigin, 503);
  }

  try {
    const tonBalanceNano = (await client.getBalance(address)).toString();
    let cetBalanceNano: string | null = null;

    const master = parseTonAddress(CET_JETTON_MASTER_ADDRESS);
    if (master) {
      const openedMaster = client.open(JettonMaster.create(master));
      const jettonWalletAddress = await openedMaster.getWalletAddress(address);
      const openedWallet = client.open(JettonWallet.create(jettonWalletAddress));
      cetBalanceNano = (await openedWallet.getBalance()).toString();
    }

    return jsonResponse(
      {
        ok: true,
        address: address.toString(),
        tonBalanceNano,
        cetBalanceNano,
        source: 'ton-sdk',
      },
      allowedOrigin,
      200,
    );
  } catch {
    return jsonResponse({ ok: false, error: 'TON request failed' }, allowedOrigin, 502);
  }
}
