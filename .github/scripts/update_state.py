"""Update app/public/api/state.json with current CET token and pool data."""

import json
import os

cet_contract = os.environ["CET_CONTRACT"]
dedust_pool = os.environ["DEDUST_POOL"]
timestamp = os.environ["TIMESTAMP"]
cet_decimals = int(os.environ.get("CET_DECIMALS", "9"))

with open("/tmp/jetton.json") as f:
    jetton = json.load(f)

with open("/tmp/pool.json") as f:
    pool = json.load(f)

with open("/tmp/prices.json") as f:
    prices = json.load(f)

# ── Token metadata ────────────────────────────────────────────────────────────
meta = jetton.get("metadata", {})
total_supply = jetton.get("total_supply")
decimals_raw = meta.get("decimals")

# ── TON USD price from DeDust prices list ─────────────────────────────────────
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
            if cet_contract and addr == cet_contract.lower() and price_str:
                try:
                    cet_price_usd = float(price_str)
                except (ValueError, TypeError):
                    pass

# ── Pool reserves ─────────────────────────────────────────────────────────────
# DeDust single-pool endpoint returns reserveLeft (TON, nanoTON) and
# reserveRight (CET, nano-CET).
reserve_left_raw = pool.get("reserveLeft")   # nanoTON string
reserve_right_raw = pool.get("reserveRight")  # nano-CET string

tvl_ton: float | None = None
if reserve_left_raw is not None:
    try:
        tvl_ton = float(reserve_left_raw) / 1e9 * 2  # both sides of symmetric pool
    except (ValueError, TypeError):
        pass

# Fall back to computing CET price from reserves if not in prices list
if cet_price_usd is None and ton_price_usd and reserve_left_raw and reserve_right_raw:
    try:
        ton_reserve = float(reserve_left_raw) / 1e9
        cet_reserve = float(reserve_right_raw) / (10 ** cet_decimals)
        if cet_reserve > 0:
            cet_price_usd = (ton_reserve / cet_reserve) * ton_price_usd
    except (ValueError, TypeError, ZeroDivisionError):
        pass

tvl_usd: float | None = None
if tvl_ton is not None and ton_price_usd is not None:
    tvl_usd = tvl_ton * ton_price_usd

# ── Write state ───────────────────────────────────────────────────────────────
state = {
    "token": {
        "symbol": meta.get("symbol") or "CET",
        "name": meta.get("name") or "SOLARIS CET",
        "contract": cet_contract,
        "totalSupply": total_supply if total_supply is not None else None,
        "decimals": int(decimals_raw) if decimals_raw is not None else cet_decimals,
    },
    "pool": {
        "address": dedust_pool,
        "tvlTon": round(tvl_ton, 4) if tvl_ton is not None else None,
        "tvlUsd": round(tvl_usd, 2) if tvl_usd is not None else None,
        "priceUsd": round(cet_price_usd, 6) if cet_price_usd is not None else None,
        "tonPriceUsd": round(ton_price_usd, 4) if ton_price_usd is not None else None,
    },
    "updatedAt": timestamp,
}

with open("app/public/api/state.json", "w") as f:
    json.dump(state, f, indent=2)

print("state.json written successfully")
