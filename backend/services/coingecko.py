"""Service para CoinGecko — preços on-chain dos tokens de carbono."""

import httpx
from cache.redis import cache_get, cache_set, TTL
from services.mock_data import PROTOCOL_CARDS, PRICE_SPREAD

BASE_URL = "https://api.coingecko.com/api/v3"

TOKEN_IDS = {
    "BCT": "toucan-protocol-base-carbon-tonne",
    "NCT": "toucan-protocol-nature-carbon-tonne",
    "KLIMA": "klima-dao",
    "MCO2": "moss-carbon-credit",
    "NBO": "c3-nature-based-offset",
}

ALL_IDS = ",".join(TOKEN_IDS.values())


async def get_token_prices() -> dict:
    cache_key = "coingecko:prices"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"{BASE_URL}/simple/price",
                params={"ids": ALL_IDS, "vs_currencies": "usd", "include_24hr_change": "true"},
            )
            resp.raise_for_status()
            raw = resp.json()

        prices = {}
        for symbol, cg_id in TOKEN_IDS.items():
            entry = raw.get(cg_id, {})
            prices[symbol] = {
                "price_usd": entry.get("usd", 0),
                "change_24h": entry.get("usd_24h_change", 0),
            }

        await cache_set(cache_key, prices, TTL["coingecko"])
        return prices
    except Exception:
        # fallback mock
        prices = {}
        for card in PROTOCOL_CARDS:
            for symbol, price in card["token_price_usd"].items():
                prices[symbol] = {
                    "price_usd": price,
                    "change_24h": card["price_change_24h"].get(symbol, 0),
                }
        return prices


async def get_price_history(token_id: str, days: int = 365) -> list[dict]:
    cache_key = f"coingecko:history:{token_id}:{days}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.get(
                f"{BASE_URL}/coins/{token_id}/market_chart",
                params={"vs_currency": "usd", "days": days},
            )
            resp.raise_for_status()
            data = resp.json()
            history = [
                {"timestamp": int(p[0] / 1000), "price_usd": p[1]}
                for p in data.get("prices", [])
            ]
        await cache_set(cache_key, history, TTL["coingecko"])
        return history
    except Exception:
        return []


async def get_price_spread() -> list[dict]:
    cache_key = "tokens:price_spread"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    prices = await get_token_prices()
    spread = []
    for item in PRICE_SPREAD:
        token = item["token"]
        on_chain = prices.get(token, {}).get("price_usd") or item["on_chain_usd"]
        spread.append({**item, "on_chain_usd": on_chain})

    await cache_set(cache_key, spread, TTL["coingecko"])
    return spread
