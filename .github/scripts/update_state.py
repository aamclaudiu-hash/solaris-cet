"""Update app/public/api/state.json with current CET token and pool data.

Produces the schema expected by chain-state.ts / ChainStateWidget:
  token.totalSupply    – human-readable decimal string or null
  pool.reserveTon      – TON reserve as human-readable decimal string or null
  pool.reserveCet      – CET reserve as human-readable decimal string or null
  pool.lpSupply        – always null (not available from REST)
  pool.priceTonPerCet  – spot price in TON per CET or null
"""

import json
import os

# Mirrors NANO constant in scripts/ton-indexer.ts: both TON and CET use 9 decimals.
NANO = 1_000_000_000

cet_contract = os.environ["CET_CONTRACT"]
dedust_pool = os.environ["DEDUST_POOL"]
timestamp = os.environ["TIMESTAMP"]

with open("/tmp/jetton.json") as f:
    jetton = json.load(f)

with open("/tmp/pool.json") as f:
    pool = json.load(f)


def nano_to_decimal(raw, decs=9):
    """Convert a nano-unit integer/string to a human-readable decimal string.

    Uses pure integer arithmetic (no float division) to avoid precision loss,
    mirroring bigintToDecimalString() in scripts/ton-indexer.ts.
    """
    try:
        value = int(raw)
    except (TypeError, ValueError):
        return None

    sign = "-" if value < 0 else ""
    abs_value = abs(value)
    divisor = 10 ** decs
    whole, fraction = divmod(abs_value, divisor)

    if fraction == 0:
        return f"{sign}{whole}"

    frac_str = f"{fraction:0{decs}d}".rstrip("0")
    return f"{sign}{whole}.{frac_str}"


# ── Token metadata ────────────────────────────────────────────────────────────
meta = jetton.get("metadata", {})
decimals_raw = meta.get("decimals")
try:
    _d = int(decimals_raw) if decimals_raw is not None else 9
    # Clamp to a safe range; fall back to 9 for invalid values.
    decimals = _d if 0 <= _d <= 18 else 9
except (TypeError, ValueError):
    decimals = 9

total_supply_raw = jetton.get("total_supply")
total_supply = nano_to_decimal(total_supply_raw, decimals)

# ── Pool reserves ─────────────────────────────────────────────────────────────
# DeDust single-pool endpoint returns reserveLeft (TON, nanoTON)
# and reserveRight (CET, nano-CET).
reserve_ton = nano_to_decimal(pool.get("reserveLeft"), 9)
reserve_cet = nano_to_decimal(pool.get("reserveRight"), decimals)

# ── Spot price in TON per CET ─────────────────────────────────────────────────
# Matches ton-indexer.ts: priceFraction = (reserveTon * NANO) / reserveCet
# where both TON and CET use 9 decimals (NANO = 10^9).
# price_raw is a 9-decimal fixed-point integer; nano_to_decimal formats it.
price_ton_per_cet = None
try:
    r_ton = int(pool.get("reserveLeft", 0))
    r_cet = int(pool.get("reserveRight", 0))
    if r_ton > 0 and r_cet > 0:
        price_raw = (r_ton * NANO) // r_cet
        price_ton_per_cet = nano_to_decimal(price_raw, 9)
except (TypeError, ValueError, ZeroDivisionError):
    price_ton_per_cet = None

state = {
    "token": {
        "symbol": meta.get("symbol") or "CET",
        "name": meta.get("name") or "SOLARIS CET",
        "contract": cet_contract,
        "totalSupply": total_supply,
        "decimals": decimals,
    },
    "pool": {
        "address": dedust_pool,
        "reserveTon": reserve_ton,
        "reserveCet": reserve_cet,
        "lpSupply": None,
        "priceTonPerCet": price_ton_per_cet,
    },
    "updatedAt": timestamp,
}

with open("app/public/api/state.json", "w") as f:
    json.dump(state, f, indent=2)

print("state.json written successfully")
