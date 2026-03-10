"""Update app/public/api/state.json with current CET token and pool data."""

import json
import os

cet_contract = os.environ["CET_CONTRACT"]
dedust_pool = os.environ["DEDUST_POOL"]
timestamp = os.environ["TIMESTAMP"]

with open("/tmp/jetton.json") as f:
    jetton = json.load(f)

with open("/tmp/pool.json") as f:
    pool = json.load(f)

with open("/tmp/prices.json") as f:
    prices = json.load(f)

# ── Token metadata from jetton API ──────────────────────────────────────────
meta = jetton.get("metadata", {})
total_supply = jetton.get("total_supply")
decimals_raw = meta.get("decimals")
cet_decimals = int(decimals_raw) if decimals_raw is not None else 9

# ── TON price in USD from prices endpoint ────────────────────────────────────
ton_price_usd = None
cet_price_usd = None
if isinstance(prices, list):
    for entry in prices:
        addr = entry.get("address", "")
        price_str = entry.get("price")
        if addr == "native" and price_str is not None:
            try:
                ton_price_usd = float(price_str)
            except (ValueError, TypeError):
                pass
        elif addr.lower() == cet_contract.lower() and price_str is not None:
            try:
                cet_price_usd = float(price_str)
            except (ValueError, TypeError):
                pass
        if ton_price_usd is not None and cet_price_usd is not None:
            break

# ── Pool TVL calculated from reserves ────────────────────────────────────────
# The DeDust pool response contains reserveLeft (TON, nanoton) and
# reserveRight (CET, nano-CET). TVL = 2 × TON-side (symmetric AMM pool).
tvl_ton = None
reserve_left_raw = pool.get("reserveLeft")
reserve_right_raw = pool.get("reserveRight")

if reserve_left_raw is not None:
    try:
        ton_reserve = float(reserve_left_raw) / 1e9
        tvl_ton = ton_reserve * 2  # symmetric pool ⟹ TVL = 2× one side
    except (ValueError, TypeError):
        pass

# ── Derive CET price from reserves if not in prices endpoint ────────────────
if cet_price_usd is None and ton_price_usd is not None and reserve_left_raw is not None and reserve_right_raw is not None:
    try:
        ton_r = float(reserve_left_raw) / 1e9
        cet_r = float(reserve_right_raw) / (10 ** cet_decimals)
        if cet_r > 1e-6:  # guard against near-empty pool giving inflated price
            cet_price_usd = (ton_r / cet_r) * ton_price_usd
    except (ValueError, TypeError):
        pass

tvl_usd = None
if tvl_ton is not None and ton_price_usd is not None:
    tvl_usd = tvl_ton * ton_price_usd

state = {
    "token": {
        "symbol": meta.get("symbol") if meta.get("symbol") else "CET",
        "name": meta.get("name") if meta.get("name") else "SOLARIS CET",
        "contract": cet_contract,
        "totalSupply": total_supply if total_supply is not None else None,
        "decimals": cet_decimals,
    },
    "pool": {
        "address": dedust_pool,
        "tvlTon": tvl_ton,
        "tvlUsd": tvl_usd,
        "priceUsd": cet_price_usd,
        "tonPriceUsd": ton_price_usd,
    },
    "updatedAt": timestamp,
}

with open("app/public/api/state.json", "w") as f:
    json.dump(state, f, indent=2)

print("state.json written successfully")
