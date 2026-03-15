"""Update app/public/api/state.json with live CET token and pool data from DeDust."""

import json
import os
import sys
from datetime import datetime, timezone

import requests

CET_CONTRACT = os.environ.get("CET_CONTRACT", "EQBbUfeIo6yrNRButZGdf4WRJZZ3IDkN8kHJbsKlu3xxypWX")
DEDUST_POOL = os.environ.get("DEDUST_POOL", "EQB5_hZPl4-EI1aWdLSd21c8T9PoKyZK2IJtrDFdPJIelfnB")
CET_DECIMALS = int(os.environ.get("CET_DECIMALS", "9"))
TIMESTAMP = os.environ.get("TIMESTAMP") or datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

TONAPI_BASE = "https://tonapi.io/v2"
DEDUST_BASE = "https://api.dedust.io/v2"
TIMEOUT = 15  # seconds
DECIMAL_PRECISION = 9  # decimal places used for all human-readable output strings


def fetch_json(url: str) -> "dict | list | None":
    """Fetch JSON from *url*, returning None on any error."""
    try:
        resp = requests.get(url, headers={"Accept": "application/json"}, timeout=TIMEOUT)
        resp.raise_for_status()
        return resp.json()
    except (ValueError, TypeError, requests.exceptions.RequestException) as exc:
        print(f"WARNING: failed to fetch {url}: {exc}", file=sys.stderr)
        return None


# ── 1. Jetton metadata ────────────────────────────────────────────────────────
jetton: dict = fetch_json(f"{TONAPI_BASE}/jettons/{CET_CONTRACT}") or {}
meta: dict = jetton.get("metadata", {}) if isinstance(jetton, dict) else {}
total_supply_raw = jetton.get("total_supply") if isinstance(jetton, dict) else None
decimals_raw = meta.get("decimals")

try:
    resolved_decimals = int(decimals_raw) if decimals_raw is not None else CET_DECIMALS
except (ValueError, TypeError):
    print(f"WARNING: could not parse decimals '{decimals_raw}', falling back to {CET_DECIMALS}", file=sys.stderr)
    resolved_decimals = CET_DECIMALS

# Convert raw total supply (in nano-units) to human-readable decimal string
total_supply_str: str | None = None
if total_supply_raw is not None:
    try:
        total_supply_str = f"{float(total_supply_raw) / (10 ** resolved_decimals):.{min(resolved_decimals, DECIMAL_PRECISION)}f}"
    except (ValueError, TypeError):
        pass

# ── 2. DeDust single-pool info ────────────────────────────────────────────────
pool: dict = fetch_json(f"{DEDUST_BASE}/pools/{DEDUST_POOL}") or {}

# ── 3. DeDust prices list ─────────────────────────────────────────────────────
prices = fetch_json(f"{DEDUST_BASE}/prices") or []

# ── TON / CET USD price from DeDust prices list ───────────────────────────────
ton_price_usd: float | None = None
cet_price_usd: float | None = None

if isinstance(prices, list):
    for entry in prices:
        if isinstance(entry, dict):
            addr = str(entry.get("address", "")).lower()
            price_str = entry.get("price")
            if addr == "native" and price_str:
                try:
                    ton_price_usd = float(price_str)
                except (ValueError, TypeError):
                    pass
            if CET_CONTRACT and addr == CET_CONTRACT.lower() and price_str:
                try:
                    cet_price_usd = float(price_str)
                except (ValueError, TypeError):
                    pass

# ── Pool reserves ─────────────────────────────────────────────────────────────
# DeDust single-pool endpoint: reserveLeft (TON, nanoTON), reserveRight (CET, nano-CET)
reserve_left_raw = pool.get("reserveLeft") if isinstance(pool, dict) else None
reserve_right_raw = pool.get("reserveRight") if isinstance(pool, dict) else None
lp_total_supply_raw = pool.get("lpTotalSupply") if isinstance(pool, dict) else None

# Convert raw reserves to human-readable decimal strings
reserve_ton_str: str | None = None
reserve_cet_str: str | None = None
lp_supply_str: str | None = None
price_ton_per_cet_str: str | None = None

if reserve_left_raw is not None:
    try:
        reserve_ton_str = f"{float(reserve_left_raw) / 1e9:.{DECIMAL_PRECISION}f}"
    except (ValueError, TypeError):
        pass

if reserve_right_raw is not None:
    try:
        reserve_cet_str = f"{float(reserve_right_raw) / (10 ** CET_DECIMALS):.{DECIMAL_PRECISION}f}"
    except (ValueError, TypeError):
        pass

if lp_total_supply_raw is not None:
    try:
        lp_supply_str = f"{float(lp_total_supply_raw) / 1e9:.{DECIMAL_PRECISION}f}"
    except (ValueError, TypeError):
        pass

# Compute spot price in TON per CET from reserves
if reserve_left_raw is not None and reserve_right_raw is not None:
    try:
        ton_r = float(reserve_left_raw) / 1e9
        cet_r = float(reserve_right_raw) / (10 ** CET_DECIMALS)
        if cet_r > 0:
            price_ton_per_cet_str = f"{ton_r / cet_r:.{DECIMAL_PRECISION}f}"
    except (ValueError, TypeError, ZeroDivisionError):
        pass

# Fall back to computing CET USD price from reserves if not in prices list
if cet_price_usd is None and ton_price_usd and reserve_left_raw and reserve_right_raw:
    try:
        ton_reserve = float(reserve_left_raw) / 1e9
        cet_reserve = float(reserve_right_raw) / (10 ** CET_DECIMALS)
        if cet_reserve > 0:
            cet_price_usd = (ton_reserve / cet_reserve) * ton_price_usd
    except (ValueError, TypeError, ZeroDivisionError):
        pass

# ── Write state ───────────────────────────────────────────────────────────────
state = {
    "token": {
        "symbol": meta.get("symbol") or "CET",
        "name": meta.get("name") or "SOLARIS CET",
        "contract": CET_CONTRACT,
        "totalSupply": total_supply_str,
        "decimals": resolved_decimals,
    },
    "pool": {
        "address": DEDUST_POOL,
        "reserveTon": reserve_ton_str,
        "reserveCet": reserve_cet_str,
        "lpSupply": lp_supply_str,
        "priceTonPerCet": price_ton_per_cet_str,
    },
    "updatedAt": TIMESTAMP,
}

os.makedirs("app/public/api", exist_ok=True)

with open("app/public/api/state.json", "w") as f:
    json.dump(state, f, indent=2)

print("state.json written successfully")
