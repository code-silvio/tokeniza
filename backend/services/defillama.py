"""Service para DeFi Llama — TVL de protocolos de carbono."""

import httpx
from cache.redis import cache_get, cache_set, TTL
from services.mock_data import TVL_HISTORY

BASE_URL = "https://api.llama.fi"

PROTOCOLS = {
    "toucan-protocol": "Toucan Protocol",
    "klimadao": "KlimaDAO",
    "moss-carbon-credit": "Moss.Earth",
}


async def get_tvl(protocol_slug: str) -> float:
    cache_key = f"defillama:tvl:{protocol_slug}"
    cached = await cache_get(cache_key)
    if cached is not None:
        return cached

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(f"{BASE_URL}/tvl/{protocol_slug}")
            resp.raise_for_status()
            tvl = float(resp.text.strip())
        await cache_set(cache_key, tvl, TTL["defillama"])
        return tvl
    except Exception:
        mock = TVL_HISTORY.get(protocol_slug, [])
        return mock[-1]["value"] if mock else 0.0


async def get_tvl_history(protocol_slug: str) -> list[dict]:
    cache_key = f"defillama:history:{protocol_slug}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(f"{BASE_URL}/protocol/{protocol_slug}")
            resp.raise_for_status()
            data = resp.json()
            tvl_data = data.get("tvl", [])
            history = [
                {"date": str(entry["date"]), "value": entry["totalLiquidityUSD"]}
                for entry in tvl_data[-24:]
            ]
        await cache_set(cache_key, history, TTL["defillama"])
        return history
    except Exception:
        return TVL_HISTORY.get(protocol_slug, [])


async def get_all_tvl() -> dict:
    cache_key = "defillama:all_tvl"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    result = {}
    for slug, name in PROTOCOLS.items():
        result[slug] = {"name": name, "tvl_usd": await get_tvl(slug)}

    await cache_set(cache_key, result, TTL["defillama"])
    return result
