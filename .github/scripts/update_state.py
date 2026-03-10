"""Update app/public/api/state.json with current CET token and pool data."""

import json
import os
import sys

cet_contract = os.environ["CET_CONTRACT"]
dedust_pool = os.environ["DEDUST_POOL"]
timestamp = os.environ["TIMESTAMP"]

with open("/tmp/jetton.json") as f:
    jetton = json.load(f)

with open("/tmp/pool.json") as f:
    pool = json.load(f)

meta = jetton.get("metadata", {})
total_supply = jetton.get("total_supply")
decimals_raw = meta.get("decimals")
tvl_ton = pool.get("totalSupply")
price_usd = pool.get("price")

# Pool reserves: reserves[0] = TON (nanoTON), reserves[1] = CET (nano-CET)
reserves = pool.get("reserves", [])
reserve_left = reserves[0] if len(reserves) > 0 else None   # TON reserve (nanoTON)
reserve_right = reserves[1] if len(reserves) > 1 else None  # CET reserve (nano-CET)
lp_supply = pool.get("lpSupply")

state = {
    "token": {
        "symbol": meta.get("symbol") if meta.get("symbol") else "CET",
        "name": meta.get("name") if meta.get("name") else "SOLARIS CET",
        "contract": cet_contract,
        "totalSupply": total_supply if total_supply is not None else None,
        "decimals": int(decimals_raw) if decimals_raw is not None else 9,
    },
    "pool": {
        "address": dedust_pool,
        "tvlTon": tvl_ton if tvl_ton is not None else None,
        "priceUsd": price_usd if price_usd is not None else None,
        "reserveLeft": reserve_left,   # nanoTON
        "reserveRight": reserve_right, # nano-CET
        "lpSupply": lp_supply,
    },
    "updatedAt": timestamp,
}

with open("app/public/api/state.json", "w") as f:
    json.dump(state, f, indent=2)

print("state.json written successfully")

# ── Schema validation ──────────────────────────────────────────────────────────

REQUIRED_TOP = {"token", "pool", "updatedAt"}
REQUIRED_TOKEN = {"symbol", "name", "contract", "totalSupply", "decimals"}
REQUIRED_POOL = {"address", "tvlTon", "priceUsd", "reserveLeft", "reserveRight", "lpSupply"}

errors = []

if not REQUIRED_TOP.issubset(state.keys()):
    errors.append(f"Missing top-level keys: {REQUIRED_TOP - state.keys()}")

token = state.get("token", {})
if not REQUIRED_TOKEN.issubset(token.keys()):
    errors.append(f"Missing token keys: {REQUIRED_TOKEN - token.keys()}")

pool_data = state.get("pool", {})
if not REQUIRED_POOL.issubset(pool_data.keys()):
    errors.append(f"Missing pool keys: {REQUIRED_POOL - pool_data.keys()}")

if not isinstance(token.get("decimals"), int):
    errors.append("token.decimals must be an integer")

if not isinstance(pool_data.get("address"), str):
    errors.append("pool.address must be a string")

if errors:
    for e in errors:
        print(f"SCHEMA ERROR: {e}", file=sys.stderr)
    sys.exit(1)

print("Schema validation passed ✓")

