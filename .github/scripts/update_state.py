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

meta = jetton.get("metadata", {})
total_supply = jetton.get("total_supply")
decimals_raw = meta.get("decimals")
tvl_ton = pool.get("totalSupply")
price_usd = pool.get("price")

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
    },
    "updatedAt": timestamp,
}

with open("app/public/api/state.json", "w") as f:
    json.dump(state, f, indent=2)

print("state.json written successfully")
