"""Service para Agrotoken — tokenização de grãos."""

import os
import httpx
from cache.redis import cache_get, cache_set, TTL
from services.mock_data import GRAIN_CARDS, GRAIN_PRICE_HISTORY, GRAINS_SUMMARY

BASE_URL = "https://api.agrotoken.io/v1"
API_TOKEN = os.getenv("AGROTOKEN_API_TOKEN", "")

SYMBOLS = ["SOYA", "CORA", "WHEA"]


async def _auth_headers() -> dict:
    if API_TOKEN:
        return {"Authorization": f"Bearer {API_TOKEN}"}
    return {}


async def get_grain_price(symbol: str) -> dict:
    cache_key = f"agrotoken:price:{symbol}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    headers = await _auth_headers()
    if not headers:
        mock = next((c for c in GRAIN_CARDS if c["symbol"] == symbol), None)
        return mock or {}

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(f"{BASE_URL}/tokens/{symbol}/price", headers=headers)
            resp.raise_for_status()
            data = resp.json()
        await cache_set(cache_key, data, TTL["agrotoken"])
        return data
    except Exception:
        mock = next((c for c in GRAIN_CARDS if c["symbol"] == symbol), None)
        return mock or {}


async def get_all_grains() -> list[dict]:
    cache_key = "agrotoken:all"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    headers = await _auth_headers()
    if not headers:
        return GRAIN_CARDS

    results = []
    for symbol in SYMBOLS:
        data = await get_grain_price(symbol)
        if data:
            results.append(data)

    if not results:
        return GRAIN_CARDS

    await cache_set(cache_key, results, TTL["agrotoken"])
    return results


async def get_grains_summary() -> dict:
    cache_key = "grains:summary"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    return GRAINS_SUMMARY


async def get_grain_history(symbol: str) -> list[dict]:
    cache_key = f"agrotoken:history:{symbol}"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    return GRAIN_PRICE_HISTORY.get(symbol, [])
